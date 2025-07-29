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
      const existingPayments = await paymentsAPI.getAll()
      const existingPayment = existingPayments.data.find((p: any) => 
        p.booking_id === bookingId
      )

      if (existingPayment) {
        if (['Failed', 'Pending'].includes(existingPayment.payment_status)) {
          await paymentsAPI.update(existingPayment.payment_id, {
            payment_status: 'Pending',
            transaction_id: `MPESA_${Date.now()}_${bookingId}`
          })
        }
        return existingPayment.payment_id
      }

      const paymentResp = await paymentsAPI.create({
        booking_id: bookingId,
        amount: amount.toString(),
        payment_status: 'Pending',
        payment_date: new Date().toISOString(),
        payment_method: 'mpesa',
        transaction_id: `MPESA_${Date.now()}_${bookingId}`
      })

      const paymentId = paymentResp.data.payment.payment_id
      if (!paymentId || isNaN(paymentId)) throw new Error('Invalid payment ID')
      return paymentId
    } catch (error) {
      throw error
    }
  }

  const pollPaymentStatus = async (paymentId: number) => {
    let attempts = 0
    const maxAttempts = 24

    const poll = async () => {
      attempts++
      try {
        const paymentStatusResp = await withRetry(
          () => paymentsAPI.getById(paymentId),
          { maxAttempts: 2, delay: 500 }
        )
        const paymentData = paymentStatusResp.data.data || paymentStatusResp.data
        const status = paymentData.payment_status?.toLowerCase()
        const transactionId = paymentData.transaction_id

        const hasRealMpesaReceipt = transactionId &&
          !transactionId.startsWith('MPESA_') &&
          !transactionId.startsWith('ws_CO_') &&
          transactionId.length > 10

        if (status === 'completed' || hasRealMpesaReceipt) {
          setIsPolling(false)
          setMessage({ type: 'success', text: 'Payment successful! 🎉' })
          setTimeout(() => {
            onSuccess()
            onClose()
          }, 2000)
          return
        }

        if (['failed', 'cancelled', 'canceled', 'timeout', 'expired'].includes(status)) {
          setIsPolling(false)
          setMessage({ type: 'error', text: 'Payment was cancelled or failed' })
          return
        }

        if (attempts < maxAttempts && ['pending', 'processing', 'initiated'].includes(status)) {
          setTimeout(poll, 10000)
        } else if (attempts >= maxAttempts) {
          setIsPolling(false)
          setMessage({
            type: 'error',
            text: 'Payment verification timed out. If you completed the payment, please check your M-Pesa messages and click "Check Status" below.'
          })
        }
      } catch {
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000)
        } else {
          setIsPolling(false)
          setMessage({ type: 'error', text: 'Error verifying payment. Please check your M-Pesa messages.' })
        }
      }
    }

    setTimeout(poll, 8000)
  }

  const handleManualCheck = async () => {
    if (!currentPaymentId) return

    setLoading(true)
    setMessage({ type: 'info', text: 'Checking payment status...' })

    try {
      const paymentResp = await paymentsAPI.getById(currentPaymentId)
      const paymentData = paymentResp.data.data || paymentResp.data
      const status = paymentData.payment_status?.toLowerCase()
      const transactionId = paymentData.transaction_id

      const hasRealMpesaReceipt = transactionId &&
        !transactionId.startsWith('MPESA_') &&
        !transactionId.startsWith('ws_CO_') &&
        transactionId.length > 10

      if (status === 'completed' || hasRealMpesaReceipt) {
        setMessage({ type: 'success', text: 'Payment confirmed! 🎉' })
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 1500)
      } else if (['failed', 'cancelled', 'canceled'].includes(status)) {
        setMessage({ type: 'error', text: 'Payment failed or was cancelled' })
      } else {
        setMessage({ type: 'info', text: 'Payment is still pending. Please check your M-Pesa messages or try again.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to check payment status' })
    } finally {
      setLoading(false)
    }
  }

  const handlePay = async () => {
    if (!phoneNumber) {
      setMessage({ type: 'error', text: 'Please enter phone number' })
      return
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setMessage({ type: 'error', text: 'Please enter a valid phone number in format 254XXXXXXXXX' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const paymentId = await getOrCreatePaymentRecord()
      setCurrentPaymentId(paymentId)

      const stkResponse = await mpesaAPI.initiateSTKPush({
        phoneNumber,
        amount: parseFloat(amount.toString()),
        paymentId
      })

      const isSuccess = stkResponse.data.ResponseCode === '0' ||
        stkResponse.data.success === true ||
        stkResponse.data.success === 'true'

      if (isSuccess) {
        setMessage({
          type: 'info',
          text: '📱 Payment request sent! Please check your phone and enter your M-Pesa PIN to complete the payment.'
        })

        setIsPolling(true)
        pollPaymentStatus(paymentId)
      } else {
        throw new Error(stkResponse.data.errorMessage || stkResponse.data.ResponseDescription || 'STK Push failed')
      }

    } catch (err: any) {
      const getErrorMessage = (error: any): string => {
        if (error.response?.data?.message) return error.response.data.message
        if (error.response?.data?.error) return error.response.data.error
        if (error.response?.data?.errorMessage) return error.response.data.errorMessage
        if (error.message) return error.message
        return 'Failed to process M-Pesa payment'
      }

      setMessage({ type: 'error', text: getErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-test="mpesa-modal">
      <div className="bg-white rounded-lg p-6 w-full max-w-md" data-test="mpesa-container">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Pay with M-Pesa</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
            disabled={loading || isPolling}
            data-test="close-modal-button"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <p className="text-2xl font-bold text-green-600 mb-4" data-test="amount-display">
          KES {amount.toLocaleString()}
        </p>

        <input
          type="tel"
          placeholder="254712345678"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-4"
          disabled={loading || isPolling}
          data-test="phone-input"
        />

        {message && (
          <div
            data-test={`message-${message.type}`}
            className={`mb-4 p-3 rounded-lg border flex items-center gap-2 ${
              message.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
              message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
              'bg-blue-50 border-blue-200 text-blue-700'
            }`}
          >
            {message.type === 'error' && <AlertCircle className="h-4 w-4 flex-shrink-0" />}
            {message.type === 'success' && <CheckCircle className="h-4 w-4 flex-shrink-0" />}
            {message.type === 'info' && <div className="h-4 w-4 flex-shrink-0 border-2 border-current border-t-transparent rounded-full animate-spin" />}
            <p className="text-sm" data-test="status-message">{message.text}</p>
          </div>
        )}

        {isPolling && !message && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg" data-test="polling-status">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-blue-700 text-sm">
                Waiting for payment confirmation... Please complete the payment on your phone.
              </p>
            </div>
          </div>
        )}

        {!isPolling && currentPaymentId && message?.type === 'error' && message.text.includes('timed out') && (
          <button
            onClick={handleManualCheck}
            className="w-full mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
            data-test="manual-check-button"
          >
            {loading ? 'Checking...' : 'Check Payment Status'}
          </button>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded-lg"
            disabled={loading || isPolling}
            data-test="cancel-button"
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={loading || isPolling}
            className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            data-test="pay-now-button"
          >
            {loading ? 'Processing...' : isPolling ? 'Waiting...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  )
}
