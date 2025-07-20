// MyPayments.tsx
import PaymentHistory from './PaymentHistory'
import PaymentMethod from './PaymentMethod'

const MyPayments = () => {
  return (
    <div className="space-y-8">
      <PaymentMethod />
      <hr className="border-t border-gray-200" />
      <PaymentHistory />
    </div>
  )
}

export default MyPayments
