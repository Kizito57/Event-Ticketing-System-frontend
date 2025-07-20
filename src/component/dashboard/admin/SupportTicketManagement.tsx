import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { HelpCircle, Search, Clock, CheckCircle, AlertCircle, Eye, Reply } from 'lucide-react'
import { toast } from 'sonner'
import { type RootState, type AppDispatch } from '../../../store/store'
import { fetchTickets, updateTicket } from '../../../store/slices/supportTicketSlice'

const SupportTicketManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Open' | 'In Progress' | 'Closed'>('all')
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [response, setResponse] = useState('')

  const dispatch = useDispatch<AppDispatch>()
  const { tickets} = useSelector((state: RootState) => state.supportTickets)

  useEffect(() => {
    dispatch(fetchTickets())
  }, [dispatch])

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = async (ticketId: number, newStatus: string) => {
    try {
      await dispatch(updateTicket({ id: ticketId, ticketData: { status: newStatus } })).unwrap()
      toast.success(`Ticket status updated to ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update ticket status')
    }
  }

//   const getStatusIcon = (status: string) => {
//     const icons = {
//       'Open': <AlertCircle className="h-4 w-4" />,
//       'In Progress': <Clock className="h-4 w-4" />,
//       'Closed': <CheckCircle className="h-4 w-4" />
//     }
//     return icons[status as keyof typeof icons] || <HelpCircle className="h-4 w-4" />
//   }

  const getStatusColor = (status: string) => {
    const colors = {
      'Open': 'bg-red-100 text-red-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Closed': 'bg-green-100 text-green-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    closed: tickets.filter(t => t.status === 'Closed').length
  }

  const sendResponse = () => {
    if (response.trim()) {
      toast.success('Response sent successfully')
      setResponse('')
      setShowModal(false)
    } else {
      toast.error('Please enter a response')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Support Ticket Management</h1>
        <p className="text-gray-600">Manage customer support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: HelpCircle, color: 'text-blue-600' },
          { label: 'Open', value: stats.open, icon: AlertCircle, color: 'text-red-600' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-yellow-600' },
          { label: 'Closed', value: stats.closed, icon: CheckCircle, color: 'text-green-600' }
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
              <Icon className={`h-8 w-8 ${color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Subject', 'Customer', 'Status', 'Created', 'Actions'].map(header => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTickets.map((ticket) => (
              <tr key={ticket.ticket_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">#{ticket.ticket_id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium truncate max-w-xs">{ticket.subject}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">{ticket.user?.first_name} {ticket.user?.last_name}</div>
                  <div className="text-sm text-gray-500">{ticket.user?.email}</div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusUpdate(ticket.ticket_id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {/* {new Date(ticket.created_at).toLocaleDateString()} */}
                  {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'N/A'}

                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setSelectedTicket(ticket)
                      setShowModal(true)
                    }}
                    className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Ticket #{selectedTicket.ticket_id}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>

            <div className="space-y-4">
              {/* Ticket Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{selectedTicket.subject}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Customer: </span>
                    {selectedTicket.user?.first_name} {selectedTicket.user?.last_name}
                  </div>
                  <div>
                    <span className="text-gray-600">Created: </span>
                    {new Date(selectedTicket.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border p-4 rounded-lg">
                <h5 className="font-medium mb-2">Description</h5>
                <p className="text-gray-700">{selectedTicket.description}</p>
              </div>

              {/* Response */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium mb-3 flex items-center">
                  <Reply className="h-5 w-5 mr-2" />
                  Admin Response
                </h5>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <div className="space-x-2">
                  {['In Progress', 'Closed'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedTicket.ticket_id, status)}
                      className={`px-4 py-2 rounded-lg text-white ${
                        status === 'In Progress' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      Mark {status}
                    </button>
                  ))}
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={sendResponse}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Send Response
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupportTicketManagement