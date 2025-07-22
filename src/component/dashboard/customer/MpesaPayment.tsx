
import React, { useState } from 'react'
import { toast } from 'sonner'
import { XCircle } from 'lucide-react'

interface MpesaPaymentModalProps {
  paymentId: number | null
  amount: number
  onClose: () => void
}

const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({ paymentId, amount, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    if (!phoneNumber || !paymentId) {
      toast.error('Please enter phone number and ensure payment ID is valid')
      return
    }

    try {
      setLoading(true)

      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, amount, paymentId })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('STK Push sent! Check your phone.')
        onClose()
      } else {
        toast.error(data.message || 'STK Push failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to initiate M-Pesa payment')
    } finally {
      setLoading(false)
    }
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
        <input
          type="tel"
          placeholder="Enter Safaricom phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MpesaPaymentModal
