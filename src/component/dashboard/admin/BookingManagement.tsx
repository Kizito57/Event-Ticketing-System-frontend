import { useEffect, useState } from 'react' 
import { useDispatch, useSelector } from 'react-redux'
import { type AppDispatch, type RootState } from '../../../store/store'
import {
  fetchBookings,
  deleteBooking,
  updateBooking,
} from '../../../store/slices/bookingSlice'
import { Search, Users, CheckCircle, Clock } from 'lucide-react' // Icons for stats and search

const BookingManagement = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { bookings, loading, error } = useSelector((state: RootState) => state.bookings)

  const [editID, setEditID] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    user_id: '',
    event_id: '',
    quantity: '',
    total_amount: '',
    booking_status: '',
  })

  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchBookings())
  }, [dispatch])

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      dispatch(deleteBooking(id))
    }
  }

  const handleEditClick = (booking: any) => {
    setEditID(booking.booking_id)
    setFormData({
      user_id: booking.user_id.toString(),
      event_id: booking.event_id.toString(),
      quantity: booking.quantity.toString(),
      total_amount: booking.total_amount.toString(),
      booking_status: booking.booking_status,
    })
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdate = () => {
    if (editID !== null) {
      dispatch(updateBooking({
        id: editID,
        data: {
          user_id: Number(formData.user_id),
          event_id: Number(formData.event_id),
          quantity: Number(formData.quantity),
          total_amount: parseFloat(formData.total_amount),
          booking_status: formData.booking_status,
        }
      }))
      setEditID(null)
    }
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString()

  // Filter bookings based on search term (user_id, event_id or status)
  const filteredBookings = bookings.filter((booking) => {
    const lowerSearch = searchTerm.toLowerCase()
    return (
      booking.user_id.toString().includes(lowerSearch) ||
      booking.event_id.toString().includes(lowerSearch) ||
      booking.booking_status.toLowerCase().includes(lowerSearch)
    )
  })

  // Stats calculation
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.booking_status === 'Confirmed').length,
    pending: bookings.filter(b => b.booking_status === 'Pending').length,
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Booking Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-base-100 border border-base-300 rounded-xl shadow p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-base-content/70">Total Bookings</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
          <Users className="h-8 w-8 text-blue-600" />
        </div>
        <div className="bg-base-100 border border-base-300 rounded-xl shadow p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-base-content/70">Confirmed</p>
            <p className="text-xl font-bold">{stats.confirmed}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <div className="bg-base-100 border border-base-300 rounded-xl shadow p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-base-content/70">Pending</p>
            <p className="text-xl font-bold">{stats.pending}</p>
          </div>
          <Clock className="h-8 w-8 text-yellow-600" />
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by User ID, Event ID, or Status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered pl-10 w-full"
        />
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full bg-base-100 shadow-lg rounded-lg">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User ID</th>
              <th>Event ID</th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-base-content/60">
                  No bookings found
                </td>
              </tr>
            ) : filteredBookings.map((booking) =>
              editID === booking.booking_id ? (
                <tr key={booking.booking_id}>
                  <td>{booking.booking_id}</td>
                  <td><input name="user_id" value={formData.user_id} onChange={handleEditChange} /></td>
                  <td><input name="event_id" value={formData.event_id} onChange={handleEditChange} /></td>
                  <td><input name="quantity" type="number" value={formData.quantity} onChange={handleEditChange} /></td>
                  <td><input name="total_amount" type="number" step="0.01" value={formData.total_amount} onChange={handleEditChange} /></td>
                  <td>
                    <select name="booking_status" value={formData.booking_status} onChange={handleEditChange}>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{formatDate(booking.created_at)}</td>
                  <td>
                    <button className="btn btn-sm btn-success" onClick={handleUpdate}>Save</button>
                    <button className="btn btn-sm" onClick={() => setEditID(null)}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={booking.booking_id}>
                  <td>{booking.booking_id}</td>
                  <td>{booking.user_id}</td>
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
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-info" onClick={() => handleEditClick(booking)}>Edit</button>
                      <button className="btn btn-sm btn-error" onClick={() => handleDelete(booking.booking_id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BookingManagement
