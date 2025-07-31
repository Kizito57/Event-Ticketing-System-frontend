import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { type AppDispatch, type RootState } from '../../../store/store'
import {
  fetchBookings,
  deleteBooking,
  updateBooking,
} from '../../../store/slices/bookingSlice'
import {
  Search,
  Users,
  CheckCircle,
  Clock,
  Pencil,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

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

  const showDeleteModal = async (bookingId: number) => {
    const booking = bookings.find(b => b.booking_id === bookingId)
    if (!booking) return

    const result = await new Promise((resolve) => {
      const modal = document.createElement('div')
      modal.className = 'fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4'
      modal.setAttribute('data-test', 'delete-modal')
      modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full" data-test="delete-modal-content">
          <h2 class="text-lg font-semibold mb-4" data-test="delete-modal-title">Delete Booking</h2>
          <p data-test="delete-modal-text">Are you sure you want to delete booking <strong>#${booking.booking_id}</strong> for User <strong>${booking.user_id}</strong>?</p>
          <div class="flex justify-end gap-3 mt-6" data-test="delete-modal-actions">
            <button id="cancel-btn" class="btn btn-outline" data-test="delete-cancel-button">Cancel</button>
            <button id="confirm-btn" class="btn btn-error text-white" data-test="delete-confirm-button">Delete</button>
          </div>
        </div>
      `
      document.body.appendChild(modal)

      const cleanup = () => document.body.removeChild(modal)

      modal.querySelector('#cancel-btn')?.addEventListener('click', () => {
        cleanup()
        resolve(false)
      })
      modal.querySelector('#confirm-btn')?.addEventListener('click', () => {
        cleanup()
        resolve(true)
      })
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          cleanup()
          resolve(false)
        }
      })
    })

    if (result) {
      try {
        await dispatch(deleteBooking(bookingId)).unwrap()
        toast.success('Booking deleted successfully')
      } catch (err) {
        toast.error('Failed to delete booking')
      }
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

const handleUpdate = async () => {
  if (editID !== null) {
    try {
      await dispatch(updateBooking({
        id: editID,
        data: {
          user_id: Number(formData.user_id),
          event_id: Number(formData.event_id),
          quantity: Number(formData.quantity),
          total_amount: parseFloat(formData.total_amount),
          booking_status: formData.booking_status,
        }
      })).unwrap()

      toast.success('Booking updated successfully')
      setEditID(null)
    } catch {
      toast.error('Failed to update booking')
    }
  }
}


  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString()

  const filteredBookings = bookings.filter((booking) => {
    const lowerSearch = searchTerm.toLowerCase()
    return (
      booking.user_id.toString().includes(lowerSearch) ||
      booking.event_id.toString().includes(lowerSearch) ||
      booking.booking_status.toLowerCase().includes(lowerSearch)
    )
  })

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.booking_status.toLowerCase() === 'confirmed').length,
    pending: bookings.filter(b => b.booking_status.toLowerCase() === 'pending').length,
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" data-test="bookings-loading">
        <span className="loading loading-spinner loading-lg" data-test="loading-spinner"></span>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6" data-test="booking-management-page">
      <div className="flex justify-between items-center mb-6" data-test="booking-header">
        <h2 className="text-2xl font-bold" data-test="booking-title">Booking Management</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-test="booking-stats">
        <div className="p-4 bg-base-100 rounded-xl shadow border flex justify-between items-center" data-test="stat-card-total">
          <div>
            <p className="text-sm text-base-content/70" data-test="stat-label">Total Bookings</p>
            <p className="text-xl font-bold" data-test="stat-value">{stats.total}</p>
          </div>
          <Users className="text-blue-600 w-7 h-7" data-test="stat-icon" />
        </div>
        <div className="p-4 bg-base-100 rounded-xl shadow border flex justify-between items-center" data-test="stat-card-confirmed">
          <div>
            <p className="text-sm text-base-content/70" data-test="stat-label">Confirmed</p>
            <p className="text-xl font-bold" data-test="stat-value">{stats.confirmed}</p>
          </div>
          <CheckCircle className="text-green-600 w-7 h-7" data-test="stat-icon" />
        </div>
        <div className="p-4 bg-base-100 rounded-xl shadow border flex justify-between items-center" data-test="stat-card-pending">
          <div>
            <p className="text-sm text-base-content/70" data-test="stat-label">Pending</p>
            <p className="text-xl font-bold" data-test="stat-value">{stats.pending}</p>
          </div>
          <Clock className="text-yellow-600 w-7 h-7" data-test="stat-icon" />
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm" data-test="booking-search">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" data-test="search-icon" />
        <input
          type="text"
          placeholder="Search by User ID, Event ID, or Status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered pl-10 w-full"
          data-test="search-input"
        />
      </div>

      {error && <div className="alert alert-error" data-test="booking-error">{error}</div>}

      <div className="overflow-x-auto" data-test="booking-table">
        <table className="table table-zebra w-full bg-base-100 rounded-lg shadow">
          <thead data-test="table-header">
            <tr>
              {['ID', 'User', 'Event', 'Qty', 'Total', 'Status', 'Created', 'Actions'].map(header => (
                <th key={header} data-test={`table-header-${header.toLowerCase()}`}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody data-test="table-body">
            {filteredBookings.length === 0 ? (
              <tr data-test="no-bookings">
                <td colSpan={8} className="text-center text-base-content/60 py-4" data-test="no-bookings-text">
                  No bookings found.
                </td>
              </tr>
            ) : filteredBookings.map((booking) =>
              editID === booking.booking_id ? (
                <tr key={booking.booking_id} data-test="booking-row" data-booking-id={booking.booking_id}>
                  <td data-test="booking-id">{booking.booking_id}</td>
                  <td><input name="user_id" value={formData.user_id} onChange={handleEditChange} data-test="edit-user-id" /></td>
                  <td><input name="event_id" value={formData.event_id} onChange={handleEditChange} data-test="edit-event-id" /></td>
                  <td><input name="quantity" value={formData.quantity} onChange={handleEditChange} data-test="edit-quantity" /></td>
                  <td><input name="total_amount" value={formData.total_amount} onChange={handleEditChange} data-test="edit-total-amount" /></td>
                  <td>
                    <select name="booking_status" value={formData.booking_status} onChange={handleEditChange} data-test="edit-status">
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td data-test="booking-created">{formatDate(booking.created_at)}</td>
                  <td data-test="edit-actions">
                    <button className="btn btn-xs btn-success mr-1" onClick={handleUpdate} data-test="save-button">Save</button>
                    <button className="btn btn-xs" onClick={() => setEditID(null)} data-test="cancel-edit-button">Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={booking.booking_id} data-test="booking-row" data-booking-id={booking.booking_id}>
                  <td data-test="booking-id">{booking.booking_id}</td>
                  <td data-test="booking-user">{booking.user_id}</td>
                  <td data-test="booking-event">{booking.event_id}</td>
                  <td data-test="booking-quantity">{booking.quantity}</td>
                  <td data-test="booking-total">${booking.total_amount}</td>
                  <td data-test="booking-status">
                    <span className={`badge ${
                      booking.booking_status === 'Confirmed'
                        ? 'badge-success'
                        : booking.booking_status === 'Pending'
                        ? 'badge-warning'
                        : 'badge-error'
                    }`} data-test="status-text">
                      {booking.booking_status}
                    </span>
                  </td>
                  <td data-test="booking-created">{formatDate(booking.created_at)}</td>
                  <td data-test="booking-actions">
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-xs" onClick={() => handleEditClick(booking)} data-test="edit-button">
                        <Pencil className="w-4 h-4 text-blue-600" data-test="edit-icon" />
                      </button>
                      <button className="btn btn-ghost btn-xs" onClick={() => showDeleteModal(booking.booking_id)} data-test="delete-button">
                        <Trash2 className="w-4 h-4 text-red-600" data-test="delete-icon" />
                      </button>
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