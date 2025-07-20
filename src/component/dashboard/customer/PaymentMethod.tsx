import React, { useState } from 'react'
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Shield,
  Star,
  XCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface PaymentMethod {
  id: number
  type: 'card' | 'paypal' | 'bank'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  email?: string
  bankName?: string
}

const PaymentMethod: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: 2,
      type: 'paypal',
      email: 'user@example.com',
      isDefault: false
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    name: '',
    isDefault: false
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const match = cleaned.match(/\d{4,16}/g)
    const matchStr = match && match[0] || ''
    const parts = []

    for (let i = 0; i < matchStr.length; i += 4) {
      parts.push(matchStr.substring(i, i + 4))
    }

    return parts.join(' ')
  }

  const resetForm = () => {
    setFormData({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      name: '',
      isDefault: false
    })
  }

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.cardNumber || !formData.expiryMonth || !formData.expiryYear || !formData.cvv || !formData.name) {
      toast.error('Please fill in all fields')
      return
    }

    const newMethod: PaymentMethod = {
      id: Date.now(),
      type: 'card',
      last4: formData.cardNumber.replace(/\s/g, '').slice(-4),
      brand: 'Visa',
      expiryMonth: parseInt(formData.expiryMonth),
      expiryYear: parseInt(formData.expiryYear),
      isDefault: formData.isDefault
    }

    if (formData.isDefault) {
      setPaymentMethods(prev => prev.map(method => ({ ...method, isDefault: false })))
    }

    setPaymentMethods(prev => [...prev, newMethod])
    setShowAddModal(false)
    resetForm()
    toast.success('Payment method added successfully')
  }

  const handleSetDefault = (id: number) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === id
    })))
    toast.success('Default payment method updated')
  }

  const handleDelete = (id: number) => {
    const method = paymentMethods.find(m => m.id === id)
    if (method?.isDefault && paymentMethods.length > 1) {
      toast.error('Cannot delete default payment method')
      return
    }
    
    setPaymentMethods(prev => prev.filter(method => method.id !== id))
    toast.success('Payment method removed')
  }

  const getCardIcon = () => <CreditCard className="h-6 w-6" />

  const renderPaymentMethod = (method: PaymentMethod) => (
    <div key={method.id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {method.type === 'card' && getCardIcon()}
          {method.type === 'paypal' && (
            <div className="w-6 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
              P
            </div>
          )}
          {method.type === 'bank' && (
            <div className="w-6 h-6 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
              B
            </div>
          )}
          
          <div>
            {method.type === 'card' && (
              <>
                <p className="font-medium text-gray-900">
                  {method.brand} •••• {method.last4}
                </p>
                <p className="text-sm text-gray-500">
                  Expires {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                </p>
              </>
            )}
            {method.type === 'paypal' && (
              <>
                <p className="font-medium text-gray-900">PayPal</p>
                <p className="text-sm text-gray-500">{method.email}</p>
              </>
            )}
            {method.type === 'bank' && (
              <>
                <p className="font-medium text-gray-900">{method.bankName}</p>
                <p className="text-sm text-gray-500">Bank Transfer</p>
              </>
            )}
          </div>
        </div>
        
        {method.isDefault && (
          <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full">
            <Star className="h-3 w-3 mr-1 fill-current" />
            <span className="text-xs font-medium">Default</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!method.isDefault && (
          <button
            onClick={() => handleSetDefault(method.id)}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Set Default
          </button>
        )}
        <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleDelete(method.id)}
          className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-600">Manage your saved payment methods</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Payment Method
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">Secure Payment Processing</h3>
            <p className="text-sm text-blue-700 mt-1">
              Your payment information is encrypted and securely stored.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map(renderPaymentMethod)}
      </div>

      {/* Empty State */}
      {paymentMethods.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
          <p className="text-gray-600">Add a payment method to get started</p>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Credit Card</h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={formatCardNumber(formData.cardNumber)}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\s/g, ''))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select
                    value={formData.expiryMonth}
                    onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {(i + 1).toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    value={formData.expiryYear}
                    onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">YYYY</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    })}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="setDefault"
                  checked={formData.isDefault}
                  onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="setDefault" className="ml-2 text-sm text-gray-700">
                  Set as default payment method
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentMethod