import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Calendar, DollarSign, Search, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { type RootState, type AppDispatch } from '../../../store/store'
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../../../store/slices/eventSlice'
import { fetchVenues } from '../../../store/slices/venueSlice'
import { API_BASE_URL } from '../../../services/api'

// Define interfaces for type safety
interface Event {
  event_id: number
  title: string
  description?: string
  venue_id: number
  category: string
  date: string
  time: string
  image_url?: string
  ticket_price: number
  tickets_total: number
  tickets_sold: number
}

interface Venue {
  venue_id: number
  name: string
  capacity: number
}

const EventManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { events = [], loading: eventsLoading, error: eventsError } = useSelector((state: RootState) => state.events)
  const { venues = [], loading: venuesLoading, error: venuesError } = useSelector((state: RootState) => state.venues)

  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue_id: '',
    category: '',
    date: '',
    time: '',
    ticket_price: '',
    tickets_total: '',
  })

  const categories = [
    'Concert', 'Conference', 'Workshop', 'Sports', 'Theater',
    'Festival', 'Exhibition', 'Networking', 'Comedy', 'Other'
  ]

  useEffect(() => {
    dispatch(fetchEvents())
    dispatch(fetchVenues())
  }, [dispatch])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSize = 100 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error('File too large. Please select an image smaller than 100MB.')
        e.target.value = ''
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file.')
        e.target.value = ''
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      toast.success(`Image selected: ${file.name} (${fileSizeMB}MB)`)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      venue_id: '',
      category: '',
      date: '',
      time: '',
      ticket_price: '',
      tickets_total: '',
    })
    setImageFile(null)
    setImagePreview('')
    setShowAddForm(false)
    setShowEditForm(false)
    setEditingEvent(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.venue_id) {
      toast.error('Please select a venue')
      return
    }
    try {
      let imageUrl = editingEvent?.image_url || ''
      if (imageFile) {
        const uploadData = new FormData()
        uploadData.append('file', imageFile)
        const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: uploadData,
        })
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text()
          let errorMessage = 'Image upload failed'
          try {
            const errorData = JSON.parse(errorText)
            if (errorData.error) errorMessage = errorData.error
          } catch {
            errorMessage = `Upload failed: ${uploadResponse.status}`
          }
          throw new Error(errorMessage)
        }
        const result = await uploadResponse.json()
        imageUrl = result.imageUrl || result.url || result.path || ''
      }
      const eventPayload = {
        title: formData.title,
        description: formData.description,
        venue_id: parseInt(formData.venue_id),
        category: formData.category,
        date: formData.date,
        time: formData.time,
        image_url: imageUrl,
        ticket_price: parseFloat(formData.ticket_price),
        tickets_total: parseInt(formData.tickets_total),
        tickets_sold: editingEvent?.tickets_sold || 0,
      }
      if (editingEvent) {
        await dispatch(updateEvent({ id: editingEvent.event_id, eventData: eventPayload })).unwrap()
        toast.success('Event updated successfully')
      } else {
        await dispatch(createEvent(eventPayload)).unwrap()
        toast.success('Event created successfully')
      }
      resetForm()
    } catch (error: any) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to save event'
      toast.error(errorMessage)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      venue_id: event.venue_id.toString(),
      category: event.category,
      date: event.date,
      time: event.time,
      ticket_price: event.ticket_price.toString(),
      tickets_total: event.tickets_total.toString(),
    })
    setImagePreview(event.image_url || '')
    setShowEditForm(true)
  }

  const handleDelete = async (event: Event) => {
    if (event.tickets_sold > 0) {
      toast.error('Cannot delete event with sold tickets')
      return
    }
    const result = await new Promise((resolve) => {
      const modal = document.createElement('div')
      modal.className = 'fixed inset-0 flex items-center justify-center'
      modal.innerHTML = `
        <div class="bg-white p-4 border rounded shadow">
          <p>Are you sure you want to delete "<strong>${event.title}</strong>"?</p>
          <div class="mt-4 flex justify-end gap-2">
            <button id="cancel-btn" class="btn btn-outline">No</button>
            <button id="delete-btn" class="btn btn-primary">Yes</button>
          </div>
        </div>
      `
      document.body.appendChild(modal)
      const cancelBtn = modal.querySelector('#cancel-btn')
      const deleteBtn = modal.querySelector('#delete-btn')
      const cleanup = () => document.body.removeChild(modal)
      cancelBtn?.addEventListener('click', () => { cleanup(); resolve(false) })
      deleteBtn?.addEventListener('click', () => { cleanup(); resolve(true) })
      modal.addEventListener('click', (e) => { if (e.target === modal) { cleanup(); resolve(false) } })
    })
    if (result) {
      try {
        await dispatch(deleteEvent(event.event_id)).unwrap()
        toast.success('Event deleted successfully')
      } catch (error: any) {
        toast.error(error || 'Failed to delete event')
      }
    }
  }

  const getVenueName = (venueId: number) => {
    const venue = venues?.find(v => v.venue_id === venueId)
    return venue?.name || 'Unknown Venue'
  }

  const filteredEvents = (events || []).filter((event: Event | undefined): event is Event => {
    return !!event && typeof event.title === 'string' && typeof event.category === 'string' && typeof event.venue_id === 'number'
  }).filter((event: Event) => {
    return (
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getVenueName(event.venue_id).toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const eventStats = {
    total: events?.length || 0,
    totalTicketsSold: (events || []).reduce((sum: number, e: Event | undefined) => sum + (e?.tickets_sold || 0), 0),
  }

  return (
    <div className="space-y-6">
      {(eventsLoading || venuesLoading) && (
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-2">Loading...</span>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
          disabled={!venues || venues.length === 0}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Event
        </button>
      </div>
      {(eventsError || venuesError) && (
        <div className="alert alert-error mb-4">
          <span>⚠️ {eventsError || venuesError}</span>
        </div>
      )}
      {(!venues || venues.length === 0) && (
        <div className="alert alert-warning">
          <span>⚠️ No venues available. Please add venues first before creating events.</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            label: 'Total Events',
            value: eventStats.total,
            icon: Calendar,
            color: 'text-indigo-600'
          },
          {
            label: 'Tickets Sold',
            value: eventStats.totalTicketsSold.toLocaleString(),
            icon: DollarSign,
            color: 'text-rose-600'
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-base-100 border border-base-300 rounded-xl shadow p-3 flex justify-between items-center min-h-[80px]">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-base-content/70 truncate">{label}</p>
              <p className="text-lg font-bold truncate">{value}</p>
            </div>
            <Icon className={`h-6 w-6 ${color} flex-shrink-0 ml-2`} />
          </div>
        ))}
      </div>
      <div className="flex justify-end items-center">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 h-5 w-5" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered pl-10 w-full"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full bg-base-100 rounded-lg shadow">
          <thead>
            <tr>
              <th className="w-20">Image</th>
              <th>Title</th>
              <th>Venue</th>
              <th>Category</th>
              <th>Date & Time</th>
              <th>Price</th>
              <th className="w-32">Tickets</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {eventsLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  <span className="loading loading-spinner loading-md"></span> Loading events...
                </td>
              </tr>
            ) : filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6">No events found</td>
              </tr>
            ) : (
              filteredEvents.map((event: Event) => {
                const soldTickets = event.tickets_sold || 0
                const availableTickets = event.tickets_total - soldTickets
                return (
                  <tr key={event.event_id}>
                    <td>
                      <div className="w-20 h-14 rounded overflow-hidden">
                        {event.image_url ? (
                          <img
                            src={event.image_url.startsWith('http') ? event.image_url : `${API_BASE_URL}${event.image_url}`}
                            className="w-full h-full object-cover"
                            alt={event.title}
                          />
                        ) : (
                          <div className="w-full h-full bg-base-200 flex items-center justify-center text-sm text-base-content/50">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-bold">{event.title || 'Untitled Event'}</div>
                        {event.description && (
                          <div className="text-sm text-base-content/70 truncate max-w-xs">
                            {event.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        {getVenueName(event.venue_id)}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline">{event.category || 'Uncategorized'}</span>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="text-blue-600">{event.date ? new Date(event.date).toLocaleDateString() : 'No date'}</div>
                        <div className="text-green-600">{event.time || 'No time'}</div>
                      </div>
                    </td>
                    <td>${event.ticket_price ? parseFloat(event.ticket_price.toString()).toFixed(2) : '0.00'}</td>
                    <td>
                      <div className="text-sm">
                        <div className="text-purple-600">Sold: {soldTickets}</div>
                        <div className="text-teal-600">Available: {availableTickets}</div>
                        <div className="text-orange-600">Total: {event.tickets_total}</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="btn btn-sm btn-ghost"
                          title="Edit Event"
                          aria-label="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event)}
                          className="btn btn-sm btn-ghost text-error"
                          title="Delete Event"
                          aria-label="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="card bg-white shadow-lg border border-base-300 max-w-2xl w-full mx-4 p-4 overflow-auto" style={{ maxHeight: '90vh' }}>
            <div className="card-body">
              <h3 className="card-title">{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Event Title *</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        aria-required="true"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Description</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Venue *</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={formData.venue_id}
                        onChange={(e) => setFormData({ ...formData, venue_id: e.target.value })}
                        required
                        aria-required="true"
                      >
                        <option value="">Select a venue</option>
                        {venues?.map((venue: Venue) => (
                          <option key={venue.venue_id} value={venue.venue_id}>
                            {venue.name} (Capacity: {venue.capacity?.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Category *</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        aria-required="true"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Date *</span>
                        </label>
                        <input
                          type="date"
                          className="input input-bordered w-full"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                          aria-required="true"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Time *</span>
                        </label>
                        <input
                          type="time"
                          className="input input-bordered w-full"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          required
                          aria-required="true"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Ticket Price ($) *</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="input input-bordered w-full"
                          value={formData.ticket_price}
                          onChange={(e) => setFormData({ ...formData, ticket_price: e.target.value })}
                          required
                          aria-required="true"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Total Tickets *</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="input input-bordered w-full"
                          value={formData.tickets_total}
                          onChange={(e) => setFormData({ ...formData, tickets_total: e.target.value })}
                          required
                          aria-required="true"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Event Image (Optional)</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input file-input-bordered w-full"
                      />
                      <div className="label">
                        <span className="label-text-alt text-info">
                          Max file size: 100MB. Supported formats: JPG, PNG, GIF, WebP
                        </span>
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Preview</span>
                      </label>
                      <div className="w-full h-64 border-2 border-dashed border-base-300 rounded-lg overflow-hidden">
                        {imagePreview ? (
                          <img
                            src={imagePreview.startsWith('data:') ? imagePreview : `${API_BASE_URL}${imagePreview}`}
                            className="w-full h-full object-cover"
                            alt="Preview"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-base-content/50">
                            <p>No image uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-actions justify-end mt-6">
                  <button type="button" onClick={resetForm} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button type="submit" onClick={handleSubmit} className="btn btn-primary">
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventManagement