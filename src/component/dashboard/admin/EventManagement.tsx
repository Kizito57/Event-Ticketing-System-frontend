import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { type AppDispatch, type RootState } from '../../../store/store'
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../../../store/slices/eventSlice'

const EventManagement = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { events, loading, error } = useSelector((state: RootState) => state.events)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue_id: 1,
    category: '',
    date: '',
    time: '',
    ticket_price: '',
    tickets_total: '',
  })

  useEffect(() => {
    dispatch(fetchEvents())
  }, [dispatch])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let imageUrl = ''

      // Upload image if selected
      if (imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)

        const uploadResponse = await fetch('http://localhost:8088/api/upload', {
          method: 'POST',
          body: uploadFormData
        })

        if (!uploadResponse.ok) throw new Error('Image upload failed')

        const uploadResult = await uploadResponse.json()
        imageUrl = uploadResult.imageUrl
      }

      const eventData = {
        ...formData,
        ticket_price: parseFloat(formData.ticket_price),
        tickets_total: parseInt(formData.tickets_total),
        image_url: imageUrl
      }

      if (editingEvent) {
        await dispatch(updateEvent({ id: editingEvent.event_id, eventData }))
        setShowEditForm(false)
        setEditingEvent(null)
      } else {
        await dispatch(createEvent(eventData))
        setShowAddForm(false)
      }

      resetForm()
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const handleEdit = (event: any) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      venue_id: event.venue_id || 1,
      category: event.category,
      date: event.date?.slice(0, 10) || '',
      time: event.time || '',
      ticket_price: event.ticket_price.toString(),
      tickets_total: event.tickets_total.toString(),
    })
    setImagePreview(event.image_url || '')
    setShowEditForm(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      dispatch(deleteEvent(id))
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      venue_id: 1,
      category: '',
      date: '',
      time: '',
      ticket_price: '',
      tickets_total: '',
    })
    setImagePreview('')
    setImageFile(null)
    setShowAddForm(false)
    setShowEditForm(false)
    setEditingEvent(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  // Ensure events is always an array
  const eventsArray = Array.isArray(events) ? events : []

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          Add New Event
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {(showAddForm || showEditForm) && (
        <div className="card bg-base-100 shadow-lg mb-6 border border-base-300">
          <div className="card-body">
            <h3 className="card-title">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Form Fields */}
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Event Title</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="textarea textarea-bordered"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Date</span>
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="input input-bordered"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Time</span>
                      </label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="input input-bordered"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Category</span>
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Ticket Price</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.ticket_price}
                        onChange={(e) => setFormData({...formData, ticket_price: e.target.value})}
                        className="input input-bordered"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Total Tickets</span>
                      </label>
                      <input
                        type="number"
                        value={formData.tickets_total}
                        onChange={(e) => setFormData({...formData, tickets_total: e.target.value})}
                        className="input input-bordered"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Event Image</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input file-input-bordered w-full"
                    />
                  </div>
                  {imagePreview && (
                    <div className="w-full">
                      <label className="label">
                        <span className="label-text">Preview</span>
                      </label>
                      <div className="w-full h-48 border-2 border-dashed border-base-300 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview.startsWith('data:') ? imagePreview : `http://localhost:8088${imagePreview}`}
                          alt="Event preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {!imagePreview && (
                    <div className="w-full h-48 border-2 border-dashed border-base-300 rounded-lg flex items-center justify-center text-base-content/50">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-base-content/30" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm">Upload event image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                <button 
                  type="button"
                  onClick={resetForm}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? 'Update Event' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full bg-base-100 shadow-lg rounded-lg">
          <thead>
            <tr>
              <th className="bg-base-200 font-semibold">Image</th>
              <th className="bg-base-200 font-semibold">ID</th>
              <th className="bg-base-200 font-semibold">Title</th>
              <th className="bg-base-200 font-semibold">Date</th>
              <th className="bg-base-200 font-semibold">Time</th>
              <th className="bg-base-200 font-semibold">Category</th>
              <th className="bg-base-200 font-semibold">Ticket Price</th>
              <th className="bg-base-200 font-semibold">Total Tickets</th>
              <th className="bg-base-200 font-semibold">Sold</th>
              <th className="bg-base-200 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {eventsArray.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-base-content/60">
                  No events found
                </td>
              </tr>
            ) : (
              eventsArray.map((event) => (
                <tr key={event.event_id}>
                  <td>
                    <div className="avatar">
                      <div className="w-16 h-12 rounded">
                        {event.image_url ? (
                          <img 
                            src={event.image_url.startsWith('http') ? event.image_url : `http://localhost:8088${event.image_url}`}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-base-300 flex items-center justify-center">
                            <svg className="w-6 h-6 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{event.event_id}</td>
                  <td className="font-medium">{event.title}</td>
                  <td>{new Date(event.date).toISOString().slice(0, 10)}</td>
                  <td>{event.time}</td>
                  <td>{event.category}</td>
                  <td className="font-semibold">${event.ticket_price}</td>
                  <td>{event.tickets_total}</td>
                  <td>{event.tickets_sold || 0}</td>
                  <td>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(event)}
                        className="btn btn-sm btn-info min-h-8 h-8"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(event.event_id)}
                        className="btn btn-sm btn-error min-h-8 h-8"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EventManagement