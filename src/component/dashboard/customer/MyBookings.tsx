import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { type AppDispatch, type RootState } from '../../../store/store'
import { fetchUserBookings, deleteBooking, updateBookingStatus } from '../../../store/slices/bookingSlice'
import { CreditCard, Smartphone, Building, Star, XCircle } from 'lucide-react'

interface PaymentMethod {
  id: number
  type: 'card' | 'mpesa' | 'bank'
  last4?: string
  brand?: string
  phoneNumber?: string
  bankName?: string
  isDefault: boolean
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 1,
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    isDefault: true
  },
  {
    id: 2,
    type: 'mpesa',
    phoneNumber: '254712345678',
    isDefault: false
  }
]

interface MpesaPaymentModalProps {
  amount: number
  onClose: () => void
  onSuccess: () => void
}

const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({ amount, onClose, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    if (!phoneNumber) return alert('Please enter phone number')
    setLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      alert('STK Push sent! Check your phone.')
      onSuccess()
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Pay with M-Pesa</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        <p className="text-2xl font-bold text-green-600 mb-4">KES {amount.toLocaleString()}</p>
        <input
          type="tel"
          placeholder="2547XXXXXXXX"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="border px-4 py-2 rounded-lg">Cancel</button>
          <button onClick={handlePay} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-lg">
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface PaymentModalProps {
  booking: any
  onClose: () => void
  onPaymentSuccess: (bookingId: number) => void
}

const PaymentModal: React.FC<PaymentModalProps> = ({ booking, onClose, onPaymentSuccess }) => {
  const [showMpesaModal, setShowMpesaModal] = useState(false)

  const handlePayment = (type: string) => {
    if (type === 'mpesa') {
      setShowMpesaModal(true)
    } else {
      // For card/bank payments, simulate immediate success
      alert('Payment successful!')
      onPaymentSuccess(booking.booking_id)
      onClose()
    }
  }

  const handleMpesaSuccess = () => {
    onPaymentSuccess(booking.booking_id)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Complete Payment</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XCircle className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p><strong>Booking ID:</strong> {booking.booking_id}</p>
            <p><strong>Quantity:</strong> {booking.quantity}</p>
            <p><strong>Amount:</strong> ${booking.total_amount}</p>
          </div>

          <h4 className="font-semibold mb-3">Choose Payment Method</h4>
          
          {mockPaymentMethods.map(method => (
            <div 
              key={method.id} 
              onClick={() => handlePayment(method.type)} 
              className="border p-4 rounded-lg cursor-pointer hover:bg-blue-50 mb-3 transition-colors"
            >
              <div className="flex items-center gap-3">
                {method.type === 'card' && <CreditCard className="h-5 w-5" />}
                {method.type === 'mpesa' && <Smartphone className="h-5 w-5" />}
                {method.type === 'bank' && <Building className="h-5 w-5" />}
                <span className="font-medium">
                  {method.type === 'card' && `${method.brand} **** ${method.last4}`}
                  {method.type === 'mpesa' && 'M-Pesa'}
                  {method.type === 'bank' && method.bankName}
                </span>
                {method.isDefault && (
                  <div className="ml-auto flex items-center text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 mr-1" /> Default
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showMpesaModal && (
        <MpesaPaymentModal
          amount={booking.total_amount}
          onClose={() => setShowMpesaModal(false)}
          onSuccess={handleMpesaSuccess}
        />
      )}
    </>
  )
}

const MyBookings = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { bookings, loading, error } = useSelector((state: RootState) => state.bookings)
  const { user } = useSelector((state: RootState) => state.auth)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)

  useEffect(() => {
    if (user && user.user_id) {
      dispatch(fetchUserBookings(user.user_id))
    }
  }, [dispatch, user?.user_id])

  console.log('👤 Current user:', user)
  console.log('📦 Bookings:', bookings)

  const handleCancelBooking = (id: number) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch(deleteBooking(id))
    }
  }

  const handlePayNow = (booking: any) => {
    setSelectedBooking(booking)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (bookingId: number) => {
    // Update the booking status to confirmed
    dispatch(updateBookingStatus({ bookingId, status: 'Confirmed' }))
    setShowPaymentModal(false)
    setSelectedBooking(null)
    
    // Refresh bookings to show updated status
    if (user?.user_id) {
      dispatch(fetchUserBookings(user.user_id))
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePayNow(booking)}
                          className="btn btn-sm btn-success"
                        >
                          Pay Now
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking.booking_id)}
                          className="btn btn-sm btn-error"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPaymentModal && selectedBooking && (
        <PaymentModal
          booking={selectedBooking}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedBooking(null)
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}

export default MyBookings