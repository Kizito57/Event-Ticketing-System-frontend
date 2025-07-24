import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MapPin,  Users, Building } from 'lucide-react'
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

  const [bookingData, setBookingData] = useState({
    quantity: ''
  })

  useEffect(() => {
    dispatch(fetchEvents())
    dispatch(fetchVenues())
  }, [dispatch])

  const handleBookEvent = (event: any) => {
    setSelectedEvent(event)
  }

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="event-browsing">
      <h2 className="text-2xl font-bold mb-6">Available Events</h2>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.filter(event => (event.tickets_total - event.tickets_sold) > 0).map(event => (
          <div key={event.event_id} className="card bg-base-100 shadow-lg">
            {event.image_url && (
              <figure>
                <img
                  src={event.image_url.startsWith('http') ? event.image_url : `http://localhost:8088${event.image_url}`}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              </figure>
            )}
            <div className="card-body">
              <h3 className="card-title">{event.title}</h3>
              <div className="space-y-1">
                <p><strong>Date:</strong> {new Date(event.date).toISOString().slice(0, 10)}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Category:</strong> {event.category}</p>
                <p><strong>Price:</strong> ${event.ticket_price}</p>
                <p><strong>Available:</strong> {event.tickets_total - event.tickets_sold} tickets</p>
              </div>
              <div className="card-actions justify-end space-x-2">
                <button
                  onClick={() => handleVenueClick(event)}
                  className="btn btn-secondary"
                >
                  Venue
                </button>
                <button
                  onClick={() => handleBookEvent(event)}
                  className="btn btn-primary"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedEvent && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg z-50">
          <h3 className="font-bold text-lg mb-4">Book {selectedEvent.title}</h3>
          <form onSubmit={handleBookingSubmit}>
            <div className="form-control mb-4">
              <label htmlFor="quantity" className="label">
                <span className="label-text">Quantity</span>
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={selectedEvent.tickets_total - selectedEvent.tickets_sold}
                value={bookingData.quantity}
                onChange={(e) => setBookingData({ ...bookingData, quantity: e.target.value })}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Venue Modal */}
      {showVenueModal && selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Venue Details</h2>

            <div className="h-48 mb-4 rounded-lg overflow-hidden">
              {selectedVenue.image_url ? (
                <img
                  src={selectedVenue.image_url.startsWith('http') ? selectedVenue.image_url : `http://localhost:8088${selectedVenue.image_url}`}
                  alt={selectedVenue.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gray-200 h-full flex items-center justify-center">
                  <Building className="h-12 w-12 text-gray-500" />
                </div>
              )}
            </div>

            <div className="space-y-2 text-gray-700 text-sm mb-4">
              <div>
                <span className="font-semibold">Name:</span> {selectedVenue.name}
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                <span>{selectedVenue.address}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                <span>Capacity: {selectedVenue.capacity.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Events at this Venue</h3>
              {events.filter(e => e.venue_id === selectedVenue.venue_id).length === 0 ? (
                <p className="text-gray-500 text-sm">No events available for this venue.</p>
              ) : (
                <ul className="space-y-1 text-sm text-gray-700">
                  {events
                    .filter(e => e.venue_id === selectedVenue.venue_id)
                    .map(e => (
                      <li key={e.event_id} className="flex justify-between border-b pb-1">
                        <span>{e.title}</span>
                        <span className="text-gray-500">{new Date(e.date).toLocaleDateString()}</span>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowVenueModal(false)}
                className="btn btn-sm btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventBrowsing
