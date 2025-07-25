import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import logo from '../assets/images/logo.jpg' 

export type Payment = {
  payment_id: number
  transaction_id?: string
  amount: number | string
  payment_status: string
  payment_method?: string
  payment_date: string
  booking_id: number
}

// Helper to convert any value to a number
const toNumber = (value: any): number => {
  const num = typeof value === 'string' ? parseFloat(value) : Number(value)
  return isNaN(num) ? 0 : num
}

// Single receipt download
export const downloadSingleReceipt = (payment: Payment) => {
  const doc = new jsPDF()

  // Add logo (must be Base64 or DataURL or loaded via <img/>)
  const img = new Image()
  img.src = logo
  img.onload = () => {
    doc.addImage(img, 'PNG', 10, 10, 30, 30)

    doc.setFontSize(18)
    doc.text('Payment Receipt', 105, 20, { align: 'center' })
    doc.setFontSize(12)
    doc.text(`Receipt ID: #${payment.payment_id}`, 105, 30, { align: 'center' })

    const fields = [
      ['Transaction ID', payment.transaction_id || 'N/A'],
      ['Amount', `KES ${toNumber(payment.amount).toFixed(2)}`],
      ['Status', payment.payment_status],
      ['Method', payment.payment_method || 'Card'],
      ['Date', new Date(payment.payment_date).toLocaleDateString()],
      ['Booking ID', `#${payment.booking_id}`]
    ]

    autoTable(doc, {
      head: [['Field', 'Value']],
      body: fields,
      startY: 45
    })

    doc.save(`Receipt_Payment_${payment.payment_id}.pdf`)
  }
}

// Bulk receipts download
export const downloadAllReceipts = (payments: Payment[]) => {
  const completed = payments.filter(p => p.payment_status === 'Completed')
  if (completed.length === 0) {
    throw new Error('No completed payments to download.')
  }

  const doc = new jsPDF()
  const img = new Image()
  img.src = logo
  img.onload = () => {
    doc.addImage(img, 'PNG', 10, 10, 30, 30)

    doc.setFontSize(18)
    doc.text('All Completed Payment Receipts', 105, 20, { align: 'center' })

    let startY = 40
    completed.forEach(payment => {
      autoTable(doc, {
        head: [[`Payment #${payment.payment_id}`, '']],
        body: [
          ['Transaction ID', payment.transaction_id || 'N/A'],
          ['Amount', `KES ${toNumber(payment.amount).toFixed(2)}`],
          ['Status', payment.payment_status],
          ['Method', payment.payment_method || 'Card'],
          ['Date', new Date(payment.payment_date).toLocaleDateString()],
          ['Booking ID', `#${payment.booking_id}`]
        ],
        startY
      })
      startY = (doc as any).lastAutoTable.finalY + 10
    })

    doc.save('All_Receipts.pdf')
  }
}
