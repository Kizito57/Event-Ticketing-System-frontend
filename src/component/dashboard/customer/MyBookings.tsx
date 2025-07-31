import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { type AppDispatch, type RootState } from '../../../store/store'
import { fetchUserBookings, deleteBooking, updateBookingStatus } from '../../../store/slices/bookingSlice'
import { CreditCard, Smartphone, Building, Star, XCircle, Calendar, Users, DollarSign, Clock } from 'lucide-react'
import { MpesaPaymentModal } from './MpesaPayment'
import { paymentsAPI } from '../../../services/api'
import { fetchEvents } from '../../../store/slices/eventSlice'
import toast from 'react-hot-toast'

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
      onPaymentSuccess(booking.booking_id)
      onClose()
    }
  }

  const handleMpesaSuccess = () => {
    onPaymentSuccess(booking.booking_id)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4" data-test="payment-modal">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all" data-test="payment-modal-content">
          <div className="flex justify-between items-center mb-6" data-test="payment-modal-header">
            <h3 className="text-xl font-bold text-gray-800" data-test="payment-modal-title">Complete Payment</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
              data-test="payment-modal-close"
            >
              <XCircle className="h-5 w-5" data-test="close-icon" />
            </button>
          </div>
          
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100" data-test="payment-details">
            <div className="space-y-2">
              <div className="flex items-center gap-2" data-test="booking-id-info">
                <span className="text-sm font-medium text-gray-600">Booking ID:</span>
                <span className="font-semibold text-gray-800" data-test="booking-id-text">#{booking.booking_id}</span>
              </div>
              <div className="flex items-center gap-2" data-test="quantity-info">
                <Users className="h-4 w-4 text-gray-500" data-test="quantity-icon" />
                <span className="text-sm font-medium text-gray-600">Quantity:</span>
                <span className="font-semibold text-gray-800" data-test="quantity-text">{booking.quantity} tickets</span>
              </div>
              <div className="flex items-center gap-2" data-test="amount-info">
                <DollarSign className="h-4 w-4 text-green-600" data-test="amount-icon" />
                <span className="text-sm font-medium text-gray-600">Amount:</span>
                <span className="font-bold text-green-600 text-lg" data-test="amount-text">KES {booking.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <h4 className="font-semibold mb-4 text-gray-800" data-test="payment-methods-title">Choose Payment Method</h4>
          
          <div className="space-y-3" data-test="payment-methods">
            {mockPaymentMethods.map(method => (
              <div 
                key={method.id} 
                onClick={() => handlePayment(method.type)} 
                className="border-2 border-gray-200 p-4 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
                data-test={`payment-method-${method.type}`}
              >
                <div className="flex items-center gap-3">
                  {method.type === 'card' && <CreditCard className="h-5 w-5 text-blue-600" data-test="card-icon" />}
                  {method.type === 'mpesa' && <Smartphone className="h-5 w-5 text-green-600" data-test="mpesa-icon" />}
                  {method.type === 'bank' && <Building className="h-5 w-5 text-purple-600" data-test="bank-icon" />}
                  <span className="font-medium text-gray-800" data-test="method-text">
                    {method.type === 'card' && `${method.brand} **** ${method.last4}`}
                    {method.type === 'mpesa' && 'M-Pesa'}
                    {method.type === 'bank' && method.bankName}
                  </span>
                  {method.isDefault && (
                    <div className="ml-auto flex items-center text-green-700 text-xs bg-green-100 px-2 py-1 rounded-full font-medium" data-test="default-badge">
                      <Star className="w-3 h-3 mr-1 fill-current" data-test="default-icon" /> Default
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showMpesaModal && (
        <MpesaPaymentModal
          amount={booking.total_amount}
          bookingId={booking.booking_id}
          onClose={() => setShowMpesaModal(false)}
          onSuccess={handleMpesaSuccess}
          data-test="mpesa-modal"
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
  const [cancelBookingId, setCancelBookingId] = useState<number | null>(null)

  useEffect(() => {
    if (user?.user_id) {
      dispatch(fetchUserBookings(user.user_id))
    }
  }, [dispatch, user?.user_id])

  const handleCancelBooking = (id: number) => {
    setCancelBookingId(id)
  }

  const confirmCancelBooking = () => {
    if (cancelBookingId) {
      dispatch(deleteBooking(cancelBookingId))
      toast.success('Booking cancelled successfully')
      setCancelBookingId(null)
    }
  }

  const handlePayNow = (booking: any) => {
    setSelectedBooking(booking)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = async (bookingId: number) => {
    try {
      console.log('🎉 Payment success callback triggered for booking:', bookingId)
      
      const loadingToast = toast.loading('Processing payment...')
      
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const payments = await paymentsAPI.getAll()
      const relatedPayment = payments.data.find((p: any) => 
        p.booking_id === bookingId
      )
      
      if (!relatedPayment) {
        console.error('❌ No payment record found for booking:', bookingId)
        toast.dismiss(loadingToast)
        toast.error('Payment record not found')
        return
      }

      console.log('💳 Payment found:', relatedPayment)
      
      const status = relatedPayment.payment_status?.toLowerCase()
      const transactionId = relatedPayment.transaction_id
      
      const hasRealMpesaReceipt = transactionId && 
        !transactionId.startsWith('MPESA_') && 
        !transactionId.startsWith('ws_CO_') &&
        transactionId.length > 10

      if (status === 'completed' || hasRealMpesaReceipt) {
        console.log('✅ Payment confirmed as successful, updating booking status...')
        
        await dispatch(updateBookingStatus({ bookingId, status: 'Confirmed' }))
        
        console.log('🎊 Booking confirmed successfully!')
        toast.dismiss(loadingToast)
        toast.success('Payment successful! Booking confirmed.', {
          duration: 5000,
          icon: '🎉',
        })
        
      } else if (status === 'pending' || status === 'processing') {
        console.log('⏳ Payment still pending - this is normal, will be updated by M-Pesa callback')
        toast.dismiss(loadingToast)
        toast('Payment is being processed. You will receive confirmation shortly.', {
          duration: 5000,
          icon: '⏳',
        })
      } else {
        console.log('❓ Payment status:', status)
        toast.dismiss(loadingToast)
        toast.error(`Payment status: ${status}`)
      }
      
      setShowPaymentModal(false)
      setSelectedBooking(null)
      
      if (user?.user_id) {
        dispatch(fetchUserBookings(user.user_id))
        dispatch(fetchEvents())
      }
      
    } catch (error) {
      console.error('❌ Error in handlePaymentSuccess:', error)
      toast.error('An error occurred while processing payment')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString()
  }

  const myBookings = bookings.filter(
    (booking) => booking.user_id === user?.user_id
  )

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" data-test="bookings-loading">
        <div className="flex flex-col items-center gap-4" data-test="loading-content">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" data-test="loading-spinner"></div>
          <span className="text-gray-600 font-medium" data-test="loading-text">Loading your bookings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="my-bookings max-w-7xl mx-auto p-6" data-test="my-bookings-page">
      <div className="mb-8" data-test="bookings-header">
        <h2 className="text-3xl font-bold text-gray-800 mb-2" data-test="bookings-title">My Bookings</h2>
        <p className="text-gray-600" data-test="bookings-subtitle">Manage and track all your event bookings</p>
      </div>

      {myBookings.length === 0 ? (
        <div className="text-center py-16" data-test="no-bookings">
          <div className="mb-4" data-test="no-bookings-icon">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto" data-test="calendar-icon" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2" data-test="no-bookings-title">No bookings yet</h3>
          <p className="text-gray-500" data-test="no-bookings-text">Start exploring events and make your first booking!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" data-test="bookings-table">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200" data-test="table-header">
                <tr>
                  {['Booking Details', 'Event', 'Tickets', 'Amount', 'Status', 'Date', 'Actions'].map(header => (
                    <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" data-test={`table-header-${header.toLowerCase().replace(' ', '-')}`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200" data-test="table-body">
                {myBookings.map((booking, index) => (
                  <tr key={booking.booking_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} data-test="booking-row" data-booking-id={booking.booking_id}>
                    <td className="px-6 py-4 whitespace-nowrap" data-test="booking-id">
                      <div className="text-sm font-medium text-gray-900" data-test="booking-id-text">#{booking.booking_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" data-test="booking-event">
                      <div className="text-sm text-gray-900" data-test="event-id-text">Event #{booking.event_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" data-test="booking-tickets">
                      <div className="flex items-center" data-test="tickets-content">
                        <Users className="h-4 w-4 text-gray-400 mr-2" data-test="tickets-icon" />
                        <span className="text-sm text-gray-900" data-test="tickets-text">{booking.quantity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" data-test="booking-amount">
                      <div className="flex items-center" data-test="amount-content">
                        <DollarSign className="h-4 w-4 text-green-500 mr-1" data-test="amount-icon" />
                        <span className="text-sm font-semibold text-gray-900" data-test="amount-text">KES {booking.total_amount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" data-test="booking-status">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        booking.booking_status === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.booking_status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`} data-test="status-text">
                        {booking.booking_status === 'Confirmed' && '✓ '}
                        {booking.booking_status === 'Pending' && <Clock className="w-3 h-3 mr-1" data-test="status-icon" />}
                        {booking.booking_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-test="booking-date">
                      {formatDate(booking.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" data-test="booking-actions">
                      {booking.booking_status === 'Pending' && (
                        <div className="flex gap-2" data-test="action-buttons">
                          <button
                            onClick={() => handlePayNow(booking)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                            data-test="pay-now-button"
                          >
                            <CreditCard className="w-4 h-4" data-test="pay-icon" />
                            Pay Now
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.booking_id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                            data-test="cancel-button"
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

      {cancelBookingId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" data-test="cancel-modal">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm" data-test="cancel-modal-content">
            <h3 className="text-lg font-semibold text-gray-800 mb-4" data-test="cancel-modal-title">Cancel Booking</h3>
            <p className="text-gray-600 mb-6" data-test="cancel-modal-text">Are you sure you want to cancel this booking?</p>
            <div className="flex gap-3" data-test="cancel-modal-actions">
              <button
                onClick={confirmCancelBooking}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                data-test="confirm-cancel-button"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setCancelBookingId(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
                data-test="keep-button"
              >
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBookings