import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { HelpCircle, Search, Clock, CheckCircle, AlertCircle, Eye, Reply, Send, User, Users } from 'lucide-react'
import { toast } from 'sonner'
import { type RootState, type AppDispatch } from '../../../store/store'
import { fetchTickets, updateTicket } from '../../../store/slices/supportTicketSlice'
import { fetchMessagesByTicketId, sendMessage, clearMessages } from '../../../store/slices/messageSlice'

const SupportTicketManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Open' | 'In Progress' | 'Closed'>('all')
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [response, setResponse] = useState('')

  const dispatch = useDispatch<AppDispatch>()
  const { tickets } = useSelector((state: RootState) => state.supportTickets)
  const { messages, loading: messagesLoading } = useSelector((state: RootState) => state.ticketMessages)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(fetchTickets())
  }, [dispatch])

  // Fetch messages when a ticket is selected
  useEffect(() => {
    if (selectedTicket && showModal) {
      dispatch(fetchMessagesByTicketId(selectedTicket.ticket_id))
    }
    return () => {
      if (!showModal) {
        dispatch(clearMessages())
      }
    }
  }, [selectedTicket, showModal, dispatch])

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
      await dispatch(fetchTickets())
      
      // Update the selected ticket if it's the one being updated
      if (selectedTicket && selectedTicket.ticket_id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus })
      }
    } catch (error) {
      toast.error('Failed to update ticket status')
    }
  }

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!response.trim() || !selectedTicket || !user) {
      toast.error('Please enter a message')
      return
    }

    try {
      await dispatch(sendMessage({
        ticket_id: selectedTicket.ticket_id,
        sender_id: user.user_id,
        content: response.trim()
      })).unwrap()
      
      toast.success('Message sent successfully')
      setResponse('')
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isAdminMessage = (senderId: number) => {
    return senderId === user?.user_id
  }

  return (
    <div className="space-y-6" data-test="support-ticket-page">
      {/* Header */}
      <div data-test="ticket-header">
        <h1 className="text-3xl font-bold text-gray-900" data-test="ticket-title">Support Ticket Management</h1>
        <p className="text-gray-600" data-test="ticket-subtitle">Manage customer support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4" data-test="ticket-stats">
        {[
          { label: 'Total', value: stats.total, icon: HelpCircle, color: 'text-blue-600' },
          { label: 'Open', value: stats.open, icon: AlertCircle, color: 'text-red-600' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-yellow-600' },
          { label: 'Closed', value: stats.closed, icon: CheckCircle, color: 'text-green-600' }
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white p-6 rounded-xl shadow-lg" data-test={`stat-card-${label.toLowerCase()}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600" data-test="stat-label">{label}</p>
                <p className="text-2xl font-bold" data-test="stat-value">{value}</p>
              </div>
              <Icon className={`h-8 w-8 ${color}`} data-test="stat-icon" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg" data-test="ticket-filters">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" data-test="search-icon" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              data-test="search-input"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            data-test="status-filter"
          >
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden" data-test="ticket-table">
        <table className="w-full">
          <thead className="bg-gray-50" data-test="table-header">
            <tr>
              {['ID', 'Subject', 'Customer', 'Status', 'Created', 'Actions'].map(header => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" data-test={`table-header-${header.toLowerCase()}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200" data-test="table-body">
            {filteredTickets.map((ticket) => (
              <tr key={ticket.ticket_id} className="hover:bg-gray-50" data-test="ticket-row" data-ticket-id={ticket.ticket_id}>
                <td className="px-6 py-4 font-medium" data-test="ticket-id">#{ticket.ticket_id}</td>
                <td className="px-6 py-4" data-test="ticket-subject">
                  <div className="font-medium truncate max-w-xs" data-test="subject-text">{ticket.subject}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs" data-test="description-text">{ticket.description}</div>
                </td>
                <td className="px-6 py-4" data-test="ticket-customer">
                  <div className="text-sm" data-test="customer-name">{ticket.user?.first_name} {ticket.user?.last_name}</div>
                  <div className="text-sm text-gray-500" data-test="customer-email">{ticket.user?.email}</div>
                </td>
                <td className="px-6 py-4" data-test="ticket-status">
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusUpdate(ticket.ticket_id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}
                    data-test="status-select"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600" data-test="ticket-created">
                  {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4" data-test="ticket-actions">
                  <button
                    onClick={() => {
                      setSelectedTicket(ticket)
                      setShowModal(true)
                    }}
                    className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                    data-test="view-ticket-button"
                  >
                    <Eye className="h-4 w-4" data-test="view-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal with Messaging */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-test="ticket-modal">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col" data-test="modal-content">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b" data-test="modal-header">
              <h3 className="text-lg font-semibold" data-test="modal-title">Ticket #{selectedTicket.ticket_id}</h3>
              <button 
                onClick={() => {
                  setShowModal(false)
                  setSelectedTicket(null)
                  dispatch(clearMessages())
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
                data-test="modal-close"
              >
                ×
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Left Side - Ticket Details */}
              <div className="w-1/3 p-6 border-r bg-gray-50" data-test="ticket-details">
                <div className="space-y-4">
                  {/* Ticket Info */}
                  <div className="bg-white p-4 rounded-lg" data-test="ticket-info">
                    <h4 className="font-semibold mb-2" data-test="ticket-subject">{selectedTicket.subject}</h4>
                    <div className="space-y-2 text-sm">
                      <div data-test="customer-info">
                        <span className="text-gray-600">Customer: </span>
                        <span className="font-medium" data-test="customer-name">{selectedTicket.user?.first_name} {selectedTicket.user?.last_name}</span>
                      </div>
                      <div data-test="email-info">
                        <span className="text-gray-600">Email: </span>
                        <span data-test="email-text">{selectedTicket.user?.email}</span>
                      </div>
                      <div data-test="created-info">
                        <span className="text-gray-600">Created: </span>
                        <span data-test="created-date">{new Date(selectedTicket.created_at).toLocaleDateString()}</span>
                      </div>
                      <div data-test="status-info">
                        <span className="text-gray-600">Status: </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedTicket.status)}`} data-test="status-text">
                          {selectedTicket.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white p-4 rounded-lg" data-test="ticket-description">
                    <h5 className="font-medium mb-2" data-test="description-title">Description</h5>
                    <p className="text-gray-700 text-sm" data-test="description-text">{selectedTicket.description}</p>
                  </div>

                  {/* Status Actions */}
                  <div className="space-y-2" data-test="quick-actions">
                    <h5 className="font-medium" data-test="actions-title">Quick Actions</h5>
                    {['In Progress', 'Closed'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedTicket.ticket_id, status)}
                        className={`w-full px-3 py-2 rounded-lg text-white text-sm ${
                          status === 'In Progress' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                        }`}
                        data-test={`action-button-${status.toLowerCase().replace(' ', '-')}`}
                      >
                        Mark {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Messages */}
              <div className="flex-1 flex flex-col" data-test="messages-section">
                {/* Messages Header */}
                <div className="p-4 border-b bg-gray-50" data-test="messages-header">
                  <h4 className="font-medium flex items-center" data-test="messages-title">
                    <Reply className="h-5 w-5 mr-2" data-test="messages-icon" />
                    Conversation
                  </h4>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" data-test="messages-list">
                  {messagesLoading ? (
                    <div className="flex justify-center py-8" data-test="messages-loading">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" data-test="loading-spinner"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500" data-test="no-messages">
                      <Reply className="h-12 w-12 mx-auto mb-2 text-gray-300" data-test="no-messages-icon" />
                      <p data-test="no-messages-text">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.message_id}
                        className={`flex ${isAdminMessage(message.sender_id) ? 'justify-end' : 'justify-start'}`}
                        data-test="message-item"
                        data-message-id={message.message_id}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isAdminMessage(message.sender_id)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                          data-test={isAdminMessage(message.sender_id) ? 'admin-message' : 'customer-message'}
                        >
                          <div className="flex items-center mb-1" data-test="message-sender">
                            {isAdminMessage(message.sender_id) ? (
                              <Users className="h-3 w-3 mr-1" data-test="admin-icon" />
                            ) : (
                              <User className="h-3 w-3 mr-1" data-test="customer-icon" />
                            )}
                            <span className="text-xs opacity-75" data-test="sender-label">
                              {isAdminMessage(message.sender_id) ? 'Admin' : 'Customer'}
                            </span>
                          </div>
                          <p className="text-sm" data-test="message-content">{message.content}</p>
                          <p className="text-xs mt-1 opacity-75" data-test="message-time">
                            {formatMessageTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t bg-gray-50" data-test="message-input">
                  <form onSubmit={handleSendMessage} className="flex gap-2" data-test="message-form">
                    <input
                      type="text"
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      data-test="message-input-field"
                    />
                    <button
                      type="submit"
                      disabled={!response.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      data-test="send-message-button"
                    >
                      <Send className="h-4 w-4" data-test="send-icon" />
                    </button>
                  </form>
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