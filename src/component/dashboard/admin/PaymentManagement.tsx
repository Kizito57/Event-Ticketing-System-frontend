import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  Search, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'
import { type RootState, type AppDispatch } from '../../../store/store'
import { fetchPayments, updatePayment } from '../../../store/slices/paymentSlice'

interface Payment {
  payment_id: number
  booking_id: number
  amount: number | string
  payment_status: string
  payment_date: string
  payment_method?: string
  transaction_id?: string
}

const PaymentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Completed' | 'Failed'>('all')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const dispatch = useDispatch<AppDispatch>()
  const { payments, loading } = useSelector((state: RootState) => state.payments)

  useEffect(() => {
    dispatch(fetchPayments())
  }, [dispatch])

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.payment_id.toString().includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || payment.payment_status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate stats with safe number conversion and formatting
  const totalRevenue = payments
    .filter(p => p.payment_status === 'Completed')
    .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0)

  const pendingCount = payments.filter(p => p.payment_status === 'Pending').length
  const completedCount = payments.filter(p => p.payment_status === 'Completed').length

  const handleStatusUpdate = async (paymentId: number, newStatus: string) => {
    try {
      await dispatch(updatePayment({ 
        id: paymentId, 
        paymentData: { payment_status: newStatus } 
      })).unwrap()
      toast.success(`Payment status updated to ${newStatus}`)
       await dispatch(fetchPayments())
    } catch (error) {
      toast.error('Failed to update payment status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Failed': return 'bg-red-100 text-red-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4" />
      case 'Failed': return <XCircle className="h-4 w-4" />
      case 'Pending': return <Clock className="h-4 w-4" />
      default: return null
    }
  }

  // Check if payment is M-Pesa and has real transaction ID (automatic update)
  const isMpesaAutoUpdated = (payment: Payment): boolean => {
    return payment.payment_method === 'mpesa' &&
           typeof payment.transaction_id === 'string' &&
           !payment.transaction_id.startsWith('MPESA_')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading payments...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-gray-600 mt-2">Monitor and manage payment transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                KES{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-600">{completedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by payment ID or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr key={payment.payment_id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">#{payment.payment_id}</div>
                  {payment.transaction_id && (
                    <div className="text-xs text-gray-500">{payment.transaction_id}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">Booking #{payment.booking_id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900">KES{Number(payment.amount).toFixed(2)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{payment.payment_method || 'Card'}</div>
                </td>
                <td className="px-6 py-4">
                  {isMpesaAutoUpdated(payment) ? (
                    // Read-only badge for M-Pesa payments with real transaction IDs
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.payment_status)}`}>
                      {getStatusIcon(payment.payment_status)}
                      <span className="ml-1">{payment.payment_status}</span>
                      <span className="ml-1 text-xs">(Auto)</span>
                    </span>
                  ) : (
                    // Editable dropdown for manual payments or pending M-Pesa
                    <select
                      value={payment.payment_status}
                      onChange={(e) => handleStatusUpdate(payment.payment_id, e.target.value)}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(payment.payment_status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Failed">Failed</option>
                    </select>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setSelectedPayment(payment)}
                    className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No payments found matching your criteria.
          </div>
        )}
      </div>

      {/* Simple Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Payment Details</h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium">#{selectedPayment.payment_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-medium">#{selectedPayment.booking_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-lg">KES{Number(selectedPayment.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="font-medium">{selectedPayment.payment_method || 'Card'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.payment_status)}`}>
                    {getStatusIcon(selectedPayment.payment_status)}
                    <span className="ml-1">{selectedPayment.payment_status}</span>
                  </span>
                  {isMpesaAutoUpdated(selectedPayment) && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Auto-Updated</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(selectedPayment.payment_date).toLocaleDateString()}
                </span>
              </div>
              {selectedPayment.transaction_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium text-sm">{selectedPayment.transaction_id}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentManagement