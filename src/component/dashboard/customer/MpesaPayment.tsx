import { useState } from 'react'
import { XCircle, AlertCircle, CheckCircle } from 'lucide-react'
import { mpesaAPI, paymentsAPI } from '../../../services/api'
import { withRetry } from '../../../utils/apiRetry'

interface MpesaPaymentModalProps {
  amount: number
  bookingId: number
  onClose: () => void
  onSuccess: () => void
}

export const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({ 
  amount, 
  bookingId, 
  onClose, 
  onSuccess 
}) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPolling, setIsPolling] = useState(false)
  const [currentPaymentId, setCurrentPaymentId] = useState<number | null>(null)
  const [message, setMessage] = useState<{type: 'error' | 'success' | 'info'; text: string} | null>(null)

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^254[0-9]{9}$/
    return phoneRegex.test(phone)
  }

  const getOrCreatePaymentRecord = async (): Promise<number> => {
    try {
      // Since booking_id is unique, there can only be one payment per booking
      const existingPayments = await paymentsAPI.getAll()
      const existingPayment = existingPayments.data.find((p: any) => 
        p.booking_id === bookingId
      )
      
      if (existingPayment) {
        console.log('Found existing payment record:', existingPayment)
        
        // If payment failed or is pending, reset it for retry
        if (['Failed', 'Pending'].includes(existingPayment.payment_status)) {
          console.log('Resetting payment status to pending for retry...')
          await paymentsAPI.update(existingPayment.payment_id, {
            payment_status: 'Pending',
            transaction_id: `MPESA_${Date.now()}_${bookingId}`
          })
        }
        
        return existingPayment.payment_id
      }

      // Create new payment record
      console.log('Creating new payment record...')
      const paymentData = {
        booking_id: bookingId,
        amount: amount.toString(),
        payment_status: 'Pending',
        payment_date: new Date().toISOString(),
        payment_method: 'mpesa',
        transaction_id: `MPESA_${Date.now()}_${bookingId}`
      }

      const paymentResp = await paymentsAPI.create(paymentData)
      console.log('Payment record created:', paymentResp.data)

      const paymentId = paymentResp.data.payment.payment_id
      
      if (!paymentId || isNaN(paymentId)) {
        console.error('Invalid payment response:', paymentResp.data)
        throw new Error('Invalid payment ID received from server')
      }

      return paymentId
    } catch (error) {
      console.error('Error with payment record:', error)
      throw error
    }
  }

  const pollPaymentStatus = async (paymentId: number) => {
    let attempts = 0
    const maxAttempts = 24 // 4 minutes (24 * 10 seconds)
    
    const poll = async () => {
      attempts++
      console.log(`Polling payment status attempt ${attempts} for payment ID: ${paymentId}`)
      
      try {
        const paymentStatusResp = await withRetry(
          () => paymentsAPI.getById(paymentId),
          { maxAttempts: 2, delay: 500 }
        )
        
        const paymentData = paymentStatusResp.data.data || paymentStatusResp.data
        const status = paymentData.payment_status?.toLowerCase()
        const transactionId = paymentData.transaction_id
        
        console.log('Current payment status:', status, 'Transaction ID:', transactionId)
        
        // ✅ Check if we have a real M-Pesa receipt (indicates successful payment)
        const hasRealMpesaReceipt = transactionId && 
          !transactionId.startsWith('MPESA_') && 
          !transactionId.startsWith('ws_CO_') && // Not CheckoutRequestID
          transactionId.length > 10 // M-Pesa receipts are typically longer

        // Success conditions
        if (status === 'completed' || hasRealMpesaReceipt) {
          console.log('✅ Payment confirmed successful!')
          setIsPolling(false)
          setMessage({type: 'success', text: 'Payment successful! 🎉'})
          setTimeout(() => {
            onSuccess()
            onClose()
          }, 2000)
          return
        }
        
        // Failure conditions
        if (['failed', 'cancelled', 'canceled', 'timeout', 'expired'].includes(status)) {
          console.log('❌ Payment failed or cancelled')
          setIsPolling(false)
          setMessage({type: 'error', text: 'Payment was cancelled or failed'})
          return
        }
        
        // Continue polling for pending/processing states
        if (attempts < maxAttempts && ['pending', 'processing', 'initiated'].includes(status)) {
          setTimeout(poll, 10000) // Poll every 10 seconds
        } else if (attempts >= maxAttempts) {
          console.log('⏰ Polling timeout reached')
          setIsPolling(false)
          setMessage({
            type: 'error', 
            text: 'Payment verification timed out. If you completed the payment, please check your M-Pesa messages and click "Check Status" below.'
          })
        }
        
      } catch (err: any) {
        console.error('Error checking payment status:', err)
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000)
        } else {
          setIsPolling(false)
          setMessage({type: 'error', text: 'Error verifying payment. Please check your M-Pesa messages.'})
        }
      }
    }
    
    // Start polling after 8 seconds to allow M-Pesa callback processing time
    setTimeout(poll, 8000)
  }

  const handleManualCheck = async () => {
    if (!currentPaymentId) return
    
    setLoading(true)
    setMessage({type: 'info', text: 'Checking payment status...'})
    
    try {
      const paymentResp = await paymentsAPI.getById(currentPaymentId)
      const paymentData = paymentResp.data.data || paymentResp.data
      const status = paymentData.payment_status?.toLowerCase()
      const transactionId = paymentData.transaction_id
      
      console.log('Manual check - Status:', status, 'Transaction ID:', transactionId)
      
      // Check for real M-Pesa receipt
      const hasRealMpesaReceipt = transactionId && 
        !transactionId.startsWith('MPESA_') && 
        !transactionId.startsWith('ws_CO_') &&
        transactionId.length > 10

      if (status === 'completed' || hasRealMpesaReceipt) {
        setMessage({type: 'success', text: 'Payment confirmed! 🎉'})
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 1500)
      } else if (['failed', 'cancelled', 'canceled'].includes(status)) {
        setMessage({type: 'error', text: 'Payment failed or was cancelled'})
      } else {
        setMessage({type: 'info', text: 'Payment is still pending. Please check your M-Pesa messages or try again.'})
      }
    } catch (error) {
      console.error('Manual check error:', error)
      setMessage({type: 'error', text: 'Failed to check payment status'})
    } finally {
      setLoading(false)
    }
  }

  const handlePay = async () => {
    if (!phoneNumber) {
      setMessage({type: 'error', text: 'Please enter phone number'})
      return
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      setMessage({type: 'error', text: 'Please enter a valid phone number in format 254XXXXXXXXX'})
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      console.log('Starting payment process for booking:', bookingId)
      
      const paymentId = await getOrCreatePaymentRecord()
      console.log('Using payment ID:', paymentId)
      setCurrentPaymentId(paymentId)

      // Initiate STK Push
      const stkResponse = await mpesaAPI.initiateSTKPush({ 
        phoneNumber, 
        amount: parseFloat(amount.toString()), 
        paymentId 
      })

      console.log('STK Push response:', stkResponse.data)
      
      // Check if STK push was successful
      const isSuccess = stkResponse.data.ResponseCode === '0' || 
                       stkResponse.data.success === true || 
                       stkResponse.data.success === 'true'
      
      if (isSuccess) {
        setMessage({
          type: 'info', 
          text: '📱 Payment request sent! Please check your phone and enter your M-Pesa PIN to complete the payment.'
        })
        
        // Start polling for payment status
        setIsPolling(true)
        pollPaymentStatus(paymentId)
      } else {
        throw new Error(stkResponse.data.errorMessage || stkResponse.data.ResponseDescription || 'STK Push failed')
      }
      
    } catch (err: any) {
      console.error('Payment error:', err)
      
      const getErrorMessage = (error: any): string => {
        if (error.response?.data?.message) return error.response.data.message
        if (error.response?.data?.error) return error.response.data.error
        if (error.response?.data?.errorMessage) return error.response.data.errorMessage
        if (error.message) return error.message
        return 'Failed to process M-Pesa payment'
      }
      
      setMessage({type: 'error', text: getErrorMessage(err)})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Pay with M-Pesa</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
            disabled={loading || isPolling}
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-2xl font-bold text-green-600 mb-4">
          KES {amount.toLocaleString()}
        </p>
        
        <input
          type="tel"
          placeholder="254712345678"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-4"
          disabled={loading || isPolling}
        />
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg border flex items-center gap-2 ${
            message.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
            message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
            'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            {message.type === 'error' && <AlertCircle className="h-4 w-4 flex-shrink-0" />}
            {message.type === 'success' && <CheckCircle className="h-4 w-4 flex-shrink-0" />}
            {message.type === 'info' && <div className="h-4 w-4 flex-shrink-0 border-2 border-current border-t-transparent rounded-full animate-spin" />}
            <p className="text-sm">{message.text}</p>
          </div>
        )}
        
        {isPolling && !message && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-blue-700 text-sm">
                Waiting for payment confirmation... Please complete the payment on your phone.
              </p>
            </div>
          </div>
        )}
        
        {/* Manual check button when polling times out */}
        {!isPolling && currentPaymentId && message?.type === 'error' && message.text.includes('timed out') && (
          <button 
            onClick={handleManualCheck}
            className="w-full mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Check Payment Status'}
          </button>
        )}
        
        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose} 
            className="border px-4 py-2 rounded-lg"
            disabled={loading || isPolling}
          >
            Cancel
          </button>
          <button 
            onClick={handlePay} 
            disabled={loading || isPolling} 
            className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Processing...' : isPolling ? 'Waiting...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  )
}