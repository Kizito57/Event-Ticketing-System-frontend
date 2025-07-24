import { useEffect, useState } from 'react' 
import { useDispatch, useSelector } from 'react-redux'
import { type AppDispatch, type RootState } from '../../../store/store'
import { fetchEvents } from '../../../store/slices/eventSlice'
import { createBooking } from '../../../store/slices/bookingSlice'

const EventBrowsing = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { events, loading, error } = useSelector((state: RootState) => state.events)
  const { user } = useSelector((state: RootState) => state.auth)

  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [bookingData, setBookingData] = useState({
    quantity: ''
  })

  useEffect(() => {
    dispatch(fetchEvents())
  }, [dispatch])

  const handleBookEvent = (event: any) => {
    setSelectedEvent(event)
  }

  // Example placeholder for Venue button click handler
  // You can modify this to open a venue modal, redirect, etc.
  const handleVenueClick = (event: any) => {
    alert(`Venue button clicked for: ${event.title}`)
    // TODO: Implement venue modal or navigation
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
                {/* Venue button on the left */}
                <button
                  onClick={() => handleVenueClick(event)}
                  className="btn btn-secondary"
                >
                  Venue
                </button>
                {/* Book Now button on the right */}
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
    </div>
  )
}

export default EventBrowsing
