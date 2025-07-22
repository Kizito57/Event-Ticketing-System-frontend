import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { type AppDispatch, type RootState } from '../../../store/store'
import { fetchUserBookings, deleteBooking } from '../../../store/slices/bookingSlice'

const MyBookings = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { bookings, loading, error } = useSelector((state: RootState) => state.bookings)
  const { user } = useSelector((state: RootState) => state.auth)

  
// useEffect(() => {
//   console.log('User ID in MyBookings:', user?.user_id);
//   if (user?.user_id) {
//     dispatch(fetchUserBookings(user.user_id));
//   }
// }, [dispatch, user?.user_id]);
// useEffect(() => {
//   console.log('Logged in user:', user)
//   console.log('Token in storage:', localStorage.getItem('token'))
//   if (user?.user_id) {
//     dispatch(fetchUserBookings(user.user_id))
//   }
// }, [dispatch, user?.user_id])

useEffect(() => {
  if (user && user.user_id) {
    dispatch(fetchUserBookings(user.user_id))
  }
}, [dispatch, user?.user_id]) // use user?.user_id as dependency

console.log('👤 Current user:', user)
console.log('📦 Bookings:', bookings)

  const handleCancelBooking = (id: number) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch(deleteBooking(id))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString()
  }

  const myBookings = bookings.filter(
    (booking) => booking.user_id === user?.user_id
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="my-bookings">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {myBookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">You have no bookings yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Event ID</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Booking Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myBookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td>{booking.booking_id}</td>
                  <td>{booking.event_id}</td>
                  <td>{booking.quantity}</td>
                  <td>${booking.total_amount}</td>
                  <td>
                    <span className={`badge ${
                      booking.booking_status === 'Confirmed'
                        ? 'badge-success'
                        : booking.booking_status === 'Pending'
                        ? 'badge-warning'
                        : 'badge-error'
                    }`}>
                      {booking.booking_status}
                    </span>
                  </td>
                  <td>{formatDate(booking.created_at)}</td>
                  <td>
                    {booking.booking_status === 'Pending' && (
                      <button
                        onClick={() => handleCancelBooking(booking.booking_id)}
                        className="btn btn-sm btn-error"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyBookings