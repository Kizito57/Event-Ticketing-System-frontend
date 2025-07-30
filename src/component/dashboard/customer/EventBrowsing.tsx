import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MapPin, Users, Building, Calendar, Clock, Tag, Ticket, X } from 'lucide-react'
import { type AppDispatch, type RootState } from '../../../store/store'
import { fetchEvents } from '../../../store/slices/eventSlice'
import { createBooking } from '../../../store/slices/bookingSlice'
import { fetchVenues } from '../../../store/slices/venueSlice'

const EventBrowsing = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { events, loading, error } = useSelector((state: RootState) => state.events)
  const { venues } = useSelector((state: RootState) => state.venues)
  const { user } = useSelector((state: RootState) => state.auth)

  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [selectedVenue, setSelectedVenue] = useState<any>(null)
  const [showVenueModal, setShowVenueModal] = useState(false)
  const [bookingData, setBookingData] = useState({ quantity: '' })

  useEffect(() => {
    dispatch(fetchEvents())
    dispatch(fetchVenues())
  }, [dispatch])

  const handleBookEvent = (event: any) => setSelectedEvent(event)

  const handleVenueClick = (event: any) => {
    const venue = venues.find(v => v.venue_id === event.venue_id)
    if (venue) {
      setSelectedVenue(venue)
      setShowVenueModal(true)
    } else {
      alert('Venue not found.')
    }
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.user_id) {
      alert('Please log in to book an event.')
      return
    }

    const quantity = parseInt(bookingData.quantity)
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid quantity.')
      return
    }

    if (quantity > (selectedEvent.tickets_total - selectedEvent.tickets_sold)) {
      alert('Not enough tickets available.')
      return
    }

    const totalAmount = quantity * selectedEvent.ticket_price

    dispatch(createBooking({
      user_id: user.user_id,
      event_id: selectedEvent.event_id,
      quantity,
      total_amount: totalAmount,
      booking_status: 'Pending'
    }))

    setSelectedEvent(null)
    setBookingData({ quantity: '' })
  }

  const availableEvents = events.filter(event => (event.tickets_total - event.tickets_sold) > 0)

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Events</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find and book tickets for the hottest events in your area
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg">
          <div className="flex">
            <div className="ml-3">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {availableEvents.map(event => (
          <div key={event.event_id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Event Image */}
            <div className="relative h-56 overflow-hidden">
              {event.image_url ? (
                <img
                  src={event.image_url.startsWith('http') ? event.image_url : `https://event-ticketing-system-backend.onrender.com${event.image_url}`}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Calendar className="h-16 w-16 text-white opacity-80" />
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-sm font-semibold text-green-600">${event.ticket_price}</span>
              </div>
            </div>

            {/* Event Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{event.title}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-3 text-blue-500" />
                  <span className="text-sm">{new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-3 text-blue-500" />
                  <span className="text-sm">{event.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Tag className="h-4 w-4 mr-3 text-blue-500" />
                  <span className="text-sm font-medium">{event.category}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Ticket className="h-4 w-4 mr-3 text-green-500" />
                  <span className="text-sm">{event.tickets_total - event.tickets_sold} tickets left</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleVenueClick(event)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-200 flex items-center justify-center"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Venue
                </button>
                <button
                  onClick={() => handleBookEvent(event)}
                  className="flex-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Events Message */}
      {availableEvents.length === 0 && !loading && (
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events available</h3>
          <p className="text-gray-600">Check back later for new events!</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Book Tickets</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mt-1">{selectedEvent.title}</p>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="p-6">
              <div className="mb-6">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of tickets
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedEvent.tickets_total - selectedEvent.tickets_sold}
                  value={bookingData.quantity}
                  onChange={(e) => setBookingData({ ...bookingData, quantity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter quantity"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Max: {selectedEvent.tickets_total - selectedEvent.tickets_sold} tickets
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Venue Modal */}
      {showVenueModal && selectedVenue && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Venue Details</h2>
                <button
                  onClick={() => setShowVenueModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Venue Image */}
              <div className="h-48 relative">
                {selectedVenue.image_url ? (
                  <img
                    src={selectedVenue.image_url.startsWith('http') ? selectedVenue.image_url : `https://event-ticketing-system-backend.onrender.com${selectedVenue.image_url}`}
                    alt={selectedVenue.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-gray-400 to-gray-600 h-full flex items-center justify-center">
                    <Building className="h-16 w-16 text-white opacity-80" />
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Venue Info */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-bold text-gray-900">{selectedVenue.name}</h3>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{selectedVenue.address}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Capacity: {selectedVenue.capacity.toLocaleString()}</span>
                  </div>
                </div>

                {/* Events at Venue */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Upcoming Events</h4>
                  {events.filter(e => e.venue_id === selectedVenue.venue_id).length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No events scheduled at this venue.</p>
                  ) : (
                    <div className="space-y-2">
                      {events
                        .filter(e => e.venue_id === selectedVenue.venue_id)
                        .map(e => (
                          <div key={e.event_id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">{e.title}</span>
                            <span className="text-sm text-gray-500">{new Date(e.date).toLocaleDateString()}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventBrowsing