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
  const [message, setMessage] = useState<{type: 'error' | 'success' | 'info'; text: string} | null>(null)

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^254[0-9]{9}$/
    return phoneRegex.test(phone)
  }

  const getOrCreatePaymentRecord = async (): Promise<number> => {
    try {
      // Check for existing payment record
      const existingPayments = await paymentsAPI.getAll()
      const existingPayment = existingPayments.data.find((p: any) => 
        p.booking_id === bookingId || 
        (p.data && p.data.booking_id === bookingId)
      )
      
      if (existingPayment) {
        console.log('Using existing payment record:', existingPayment)
        const paymentId = existingPayment.payment_id || existingPayment.data?.payment_id
        
        if (paymentId) {
          return paymentId
        }
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

      // Extract payment ID from various possible response structures
      const extractPaymentId = (data: any): number => {
        if (data?.payment_id) return data.payment_id
        if (data?.data?.payment_id) return data.data.payment_id
        if (data?.id) return data.id
        if (Array.isArray(data) && data[0]?.payment_id) return data[0].payment_id
        
        throw new Error(`Payment ID not found in server response: ${JSON.stringify(data)}`)
      }

      const paymentId = extractPaymentId(paymentResp.data)
      
      if (!paymentId || isNaN(paymentId)) {
        throw new Error('Invalid payment ID received from server')
      }

      return paymentId
    } catch (error) {
      console.error('Error with payment record:', error)
      throw error
    }
  }

  // const pollPaymentStatus = async (paymentId: number) => {
  //   let attempts = 0
  //   const maxAttempts = 12 // Poll for 2 minutes
    
  //   const poll = async () => {
  //     try {
  //       attempts++
  //       console.log(`Polling payment status attempt ${attempts} for payment ID: ${paymentId}`)
        
  //       const paymentStatusResp = await paymentsAPI.getById(paymentId)
  //       const paymentData = paymentStatusResp.data.data || paymentStatusResp.data
  //       const status = paymentData.payment_status?.toLowerCase()
        
  //       console.log('Current payment status:', status)
        
  //       // Check for success statuses
  //       if (['success', 'completed'].includes(status)) {
  //         setIsPolling(false)
  //         setMessage({type: 'success', text: 'Payment successful!'})
  //         setTimeout(() => {
  //           onSuccess()
  //           onClose()
  //         }, 2000)
  //         return
  //       }
        
  //       // Check for failure statuses
  //       if (['failed', 'cancelled'].includes(status)) {
  //         setIsPolling(false)
  //         setMessage({type: 'error', text: 'Payment failed or was cancelled'})
  //         return
  //       }
        
  //       // Continue polling if still pending
  //       if (attempts < maxAttempts && ['pending', 'processing'].includes(status)) {
  //         setTimeout(poll, 10000)
  //       } else if (attempts >= maxAttempts) {
  //         setIsPolling(false)
  //         setMessage({type: 'error', text: 'Payment status check timed out. Please check later'})
  //       }
        
  //     } catch (err: any) {
  //       console.error('Error checking payment status:', err)
  //       attempts++
  //       if (attempts < maxAttempts) {
  //         setTimeout(poll, 10000)
  //       } else {
  //         setIsPolling(false)
  //         setMessage({type: 'error', text: 'Error verifying payment. Please check later'})
  //       }
  //     }
  //   }
    
  //   setTimeout(poll, 5000) // Start polling after 5 seconds
  // }
  const pollPaymentStatus = async (paymentId: number) => {
  let attempts = 0
  const maxAttempts = 12
  
  const poll = async () => {
    attempts++
    console.log(`Polling payment status attempt ${attempts} for payment ID: ${paymentId}`)
    
    try {
      // Use retry mechanism for API calls
      const paymentStatusResp = await withRetry(
        () => paymentsAPI.getById(paymentId),
        { maxAttempts: 2, delay: 500 }
      )
      
      const paymentData = paymentStatusResp.data.data || paymentStatusResp.data
      const status = paymentData.payment_status?.toLowerCase()
      
      console.log('Current payment status:', status)
      
      if (['success', 'completed'].includes(status)) {
        setIsPolling(false)
        setMessage({type: 'success', text: 'Payment successful!'})
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 2000)
        return
      }
      
      if (['failed', 'cancelled', 'canceled', 'timeout', 'expired'].includes(status)) {
        setIsPolling(false)
        setMessage({type: 'error', text: 'Payment was cancelled or failed'})
        
        // Update payment status with retry
        try {
          await withRetry(
            () => paymentsAPI.update(paymentId, { payment_status: 'Failed' }),
            { maxAttempts: 2 }
          )
        } catch (updateError) {
          console.error('Failed to update payment status:', updateError)
        }
        return
      }
      
      if (attempts < maxAttempts && ['pending', 'processing', 'initiated'].includes(status)) {
        setTimeout(poll, 10000)
      } else if (attempts >= maxAttempts) {
        setIsPolling(false)
        setMessage({type: 'error', text: 'Payment confirmation timed out'})
        
        try {
          await withRetry(
            () => paymentsAPI.update(paymentId, { payment_status: 'Failed' }),
            { maxAttempts: 2 }
          )
        } catch (updateError) {
          console.error('Failed to update payment status:', updateError)
        }
      }
      
    } catch (err: any) {
      console.error('Error checking payment status:', err)
      if (attempts < maxAttempts) {
        setTimeout(poll, 10000)
      } else {
        setIsPolling(false)
        setMessage({type: 'error', text: 'Error verifying payment. Please check later'})
      }
    }
  }
  
  setTimeout(poll, 5000)
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

      // Initiate STK Push
      const stkResponse = await mpesaAPI.initiateSTKPush({ 
        phoneNumber, 
        amount: parseFloat(amount.toString()), 
        paymentId 
      })

      console.log('STK Push response:', stkResponse.data)
      setMessage({type: 'info', text: 'STK Push initiated! Please complete payment on your phone'})
      
      // Start polling for payment status
      setIsPolling(true)
      pollPaymentStatus(paymentId)
      
    } catch (err: any) {
      console.error('Payment error:', err)
      
      const getErrorMessage = (error: any): string => {
        if (error.response?.data?.message) return error.response.data.message
        if (error.response?.data?.error) return error.response.data.error
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
            <p className="text-blue-700 text-sm">
              ⏳ Waiting for payment confirmation... Please complete the payment on your phone.
            </p>
          </div>
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