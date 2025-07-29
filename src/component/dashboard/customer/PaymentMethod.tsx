import React, { useState } from 'react';
import {
  CreditCard, Plus, Edit, Trash2, Shield, Star, XCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentMethod {
  id: number;
  type: 'card' | 'paypal' | 'bank';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  email?: string;
  bankName?: string;
}

const defaultFormData = {
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
  name: '',
  isDefault: false
};

const PaymentMethods: React.FC = () => {
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
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ ...defaultFormData });

  const handleInputChange = (field: string, value: string | boolean) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const formatCardNumber = (value: string) =>
    value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();

  const resetForm = () => setFormData({ ...defaultFormData });

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const { cardNumber, expiryMonth, expiryYear, cvv, name, isDefault } = formData;

    if (!cardNumber || !expiryMonth || !expiryYear || !cvv || !name) {
      return toast.error('Please fill in all fields');
    }

    const newMethod: PaymentMethod = {
      id: Date.now(),
      type: 'card',
      last4: cardNumber.slice(-4),
      brand: 'Visa',
      expiryMonth: +expiryMonth,
      expiryYear: +expiryYear,
      isDefault
    };

    setPaymentMethods(prev => [
      ...(isDefault ? prev.map(p => ({ ...p, isDefault: false })) : prev),
      newMethod
    ]);

    toast.success('Payment method added');
    resetForm();
    setShowAddModal(false);
  };

  const handleSetDefault = (id: number) => {
    setPaymentMethods(prev =>
      prev.map(m => ({ ...m, isDefault: m.id === id }))
    );
    toast.success('Default updated');
  };

  const handleDelete = (id: number) => {
    const method = paymentMethods.find(m => m.id === id);
    if (method?.isDefault && paymentMethods.length > 1) {
      return toast.error('Cannot delete default payment method');
    }

    setPaymentMethods(prev => prev.filter(m => m.id !== id));
    toast.success('Payment method removed');
  };

  const renderCardIcon = () => <CreditCard className="h-6 w-6" />;

  const renderPaymentMethod = (method: PaymentMethod) => (
    <div key={method.id} className="bg-white rounded-lg shadow border p-4 space-y-4 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex gap-3 items-start">
          {method.type === 'card' && renderCardIcon()}
          {method.type === 'paypal' && <div className="w-6 h-6 bg-blue-600 text-white flex items-center justify-center rounded text-xs font-bold">P</div>}
          {method.type === 'bank' && <div className="w-6 h-6 bg-green-600 text-white flex items-center justify-center rounded text-xs font-bold">B</div>}
          <div>
            <p className="font-medium text-gray-900">
              {method.type === 'card' && `${method.brand} •••• ${method.last4}`}
              {method.type === 'paypal' && 'PayPal'}
              {method.type === 'bank' && method.bankName}
            </p>
            <p className="text-sm text-gray-500">
              {method.type === 'card' && `Expires ${String(method.expiryMonth).padStart(2, '0')}/${method.expiryYear}`}
              {method.type === 'paypal' && method.email}
              {method.type === 'bank' && 'Bank Transfer'}
            </p>
          </div>
        </div>

        {method.isDefault && (
          <span className="flex items-center gap-1 text-green-700 bg-green-100 text-xs px-2 py-1 rounded-full">
            <Star className="w-3 h-3 fill-current" />
            Default
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {!method.isDefault && (
          <button onClick={() => handleSetDefault(method.id)} className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700">
            Set Default
          </button>
        )}
        <button className="text-gray-600 border border-gray-300 rounded p-2 hover:bg-gray-50">
          <Edit className="h-4 w-4" />
        </button>
        <button onClick={() => handleDelete(method.id)} className="text-red-600 border border-red-300 rounded p-2 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-600">Manage your saved payment methods</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Payment Method
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3">
        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <p className="font-medium text-blue-900 text-sm">Secure Payment Processing</p>
          <p className="text-blue-700 text-sm">Your payment information is encrypted and securely stored.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map(renderPaymentMethod)}
      </div>

      {paymentMethods.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No payment methods</h3>
          <p className="text-gray-600">Add a payment method to get started</p>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Credit Card</h3>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCard} className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                maxLength={19}
                value={formatCardNumber(formData.cardNumber)}
                onChange={e => handleInputChange('cardNumber', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={formData.expiryMonth}
                  onChange={e => handleInputChange('expiryMonth', e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">MM</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {(i + 1).toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.expiryYear}
                  onChange={e => handleInputChange('expiryYear', e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">YYYY</option>
                  {[...Array(10)].map((_, i) => {
                    const year = new Date().getFullYear() + i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
                <input
                  type="text"
                  placeholder="CVV"
                  maxLength={4}
                  value={formData.cvv}
                  onChange={e => handleInputChange('cvv', e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Cardholder Name"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={e => handleInputChange('isDefault', e.target.checked)}
                  className="h-4 w-4 text-blue-600"
                />
                Set as default payment method
              </label>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => { setShowAddModal(false); resetForm(); }} className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
