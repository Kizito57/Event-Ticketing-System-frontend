import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { MapPin, Search, Plus, Edit, Trash2, Users, Building, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { type RootState, type AppDispatch } from '../../../store/store'
import { fetchVenues, createVenue, updateVenue, deleteVenue } from '../../../store/slices/venueSlice'

const VenueManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create')
  const [selectedVenue, setSelectedVenue] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    capacity: 0,
    image_url: ''
  })

  const dispatch = useDispatch<AppDispatch>()
  const { venues } = useSelector((state: RootState) => state.venues)
  const { events } = useSelector((state: RootState) => state.events)

  useEffect(() => {
    dispatch(fetchVenues())
  }, [dispatch])

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getVenueStats = (venueId: number) => {
    const venueEvents = events?.filter(event => event.venue_id === venueId) || []
    const upcomingEvents = venueEvents.filter(event => new Date(event.date) >= new Date())
    const totalBookings = venueEvents.reduce((sum, event) => sum + (event.tickets_sold || 0), 0)
    
    return {
      totalEvents: venueEvents.length,
      upcomingEvents: upcomingEvents.length,
      totalBookings
    }
  }

  const openModal = (type: 'create' | 'edit' | 'delete', venue?: any) => {
    setModalType(type)
    setSelectedVenue(venue || null)
    
    if (type === 'create') {
      setFormData({ name: '', address: '', capacity: 0, image_url: '' })
    } else if (type === 'edit' && venue) {
      setFormData({
        name: venue.name,
        address: venue.address,
        capacity: venue.capacity,
        image_url: venue.image_url || ''
      })
    }
    
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (modalType === 'create') {
        await dispatch(createVenue(formData)).unwrap()
        toast.success('Venue created successfully')
      } else if (modalType === 'edit' && selectedVenue) {
        await dispatch(updateVenue({ id: selectedVenue.venue_id, venueData: formData })).unwrap()
        toast.success('Venue updated successfully')
      } else if (modalType === 'delete' && selectedVenue) {
        const venueEvents = events?.filter(event => event.venue_id === selectedVenue.venue_id) || []
        if (venueEvents.length > 0) {
          toast.error('Cannot delete venue with existing events')
          return
        }
        
        await dispatch(deleteVenue(selectedVenue.venue_id)).unwrap()
        toast.success('Venue deleted successfully')
      }
      
      setShowModal(false)
      setSelectedVenue(null)
    } catch (error) {
      toast.error(`Failed to ${modalType} venue`)
    }
  }

  const stats = {
    total: venues.length,
    capacity: venues.reduce((sum, venue) => sum + venue.capacity, 0),
    active: venues.filter(venue => 
      events?.some(event => 
        event.venue_id === venue.venue_id && new Date(event.date) >= new Date()
      )
    ).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Venue Management</h1>
          <p className="text-gray-600">Manage event venues and capacities</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Venue
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Total Venues', value: stats.total, icon: Building, color: 'text-blue-600' },
          { label: 'Total Capacity', value: stats.capacity.toLocaleString(), icon: Users, color: 'text-green-600' },
          { label: 'Active Venues', value: stats.active, icon: Calendar, color: 'text-purple-600' }
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
              <Icon className={`h-8 w-8 ${color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => {
          const stats = getVenueStats(venue.venue_id)
          
          return (
            <div key={venue.venue_id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                {venue.image_url ? (
                  <img src={venue.image_url} alt={venue.name} className="w-full h-full object-cover" />
                ) : (
                  <Building className="h-16 w-16 text-white opacity-50" />
                )}
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">{venue.name}</h3>
                
                <div className="flex items-start text-sm text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="truncate">{venue.address}</span>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="font-bold">{venue.capacity.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Capacity</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="font-bold">{stats.totalEvents}</div>
                    <div className="text-xs text-gray-600">Events</div>
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="font-bold text-blue-600">{stats.upcomingEvents}</div>
                    <div className="text-xs text-gray-600">Upcoming</div>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <div className="font-bold text-green-600">{stats.totalBookings}</div>
                    <div className="text-xs text-gray-600">Bookings</div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal('edit', venue)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => openModal('delete', venue)}
                    className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {modalType === 'create' && 'Create New Venue'}
              {modalType === 'edit' && 'Edit Venue'}
              {modalType === 'delete' && 'Delete Venue'}
            </h3>
            
            {modalType === 'delete' ? (
              <div>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete "{selectedVenue?.name}"? This cannot be undone.
                  {events?.filter(event => event.venue_id === selectedVenue?.venue_id).length > 0 && (
                    <span className="block mt-2 text-red-600 font-medium">
                      Warning: This venue has existing events and cannot be deleted.
                    </span>
                  )}
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={events?.filter(event => event.venue_id === selectedVenue?.venue_id).length > 0}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Venue Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                
                <textarea
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
                
                <input
                  type="number"
                  placeholder="Capacity"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
                
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {modalType === 'create' ? 'Create' : 'Update'} Venue
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default VenueManagement