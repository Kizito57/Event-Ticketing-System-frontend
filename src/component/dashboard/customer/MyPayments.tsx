import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Search, CreditCard, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { type RootState, type AppDispatch } from '../../../store/store'
import { fetchPayments } from '../../../store/slices/paymentSlice'

// interface Payment {
//   payment_id: number
//   booking_id: number
//   amount: number
//   payment_status: string
//   payment_date: string
//   payment_method?: string
//   transaction_id?: string
//   created_at?: string
//   updated_at?: string
// }

const MyPayments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all')

  const dispatch = useDispatch<AppDispatch>()
  const { payments, loading } = useSelector((state: RootState) => state.payments)

  useEffect(() => {
    dispatch(fetchPayments())
  }, [dispatch])

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.booking_id.toString().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
      payment.payment_status.toLowerCase() === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': 
      case 'success': 
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending': 
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed': 
      case 'rejected': 
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default: 
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const totalAmount = payments
    .filter(p => p.payment_status.toLowerCase() === 'completed' || p.payment_status.toLowerCase() === 'success')
    .reduce((sum, payment) => sum + payment.amount, 0)

  const completedPayments = payments.filter(p => 
    p.payment_status.toLowerCase() === 'completed' || p.payment_status.toLowerCase() === 'success'
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment History</h1>
        <p className="text-gray-600">Track your payment transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedPayments}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">${totalAmount.toFixed(2)}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by transaction ID or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <div key={payment.payment_id} className="bg-white rounded-lg shadow p-4 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="font-semibold text-gray-900">
                    ${payment.amount.toFixed(2)}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.payment_status)}`}>
                    {getStatusIcon(payment.payment_status)}
                    <span className="ml-1">{payment.payment_status}</span>
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Booking ID:</span>
                    <p>#{payment.booking_id}</p>
                  </div>
                  <div>
                    <span className="font-medium">Transaction ID:</span>
                    <p>{payment.transaction_id || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Payment Method:</span>
                    <p>{payment.payment_method || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPayments.length === 0 && !loading && (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
          <p className="text-gray-600">
            {payments.length === 0 
              ? "You haven't made any payments yet" 
              : "No payments match your current filters"}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading payments...</p>
        </div>
      )}
    </div>
  )
}

export default MyPayments