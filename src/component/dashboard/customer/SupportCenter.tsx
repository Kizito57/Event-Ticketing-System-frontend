import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Plus, Search, AlertCircle, Clock, CheckCircle, Calendar, MessageCircle, Send, User, Users } from 'lucide-react'
import { toast } from 'sonner'
import { type RootState, type AppDispatch } from '../../../store/store'
import { fetchUserTickets, createTicket } from '../../../store/slices/supportTicketSlice'
import { fetchMessagesByTicketId, sendMessage, clearMessages } from '../../../store/slices/messageSlice'

const SupportCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showMessagesModal, setShowMessagesModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [newTicket, setNewTicket] = useState({ subject: '', description: '' })
  const [newMessage, setNewMessage] = useState('')

  const dispatch = useDispatch<AppDispatch>()
  const { tickets, loading } = useSelector((state: RootState) => state.supportTickets)
  const { messages, loading: messagesLoading } = useSelector((state: RootState) => state.ticketMessages)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (user?.user_id) {
      dispatch(fetchUserTickets(user.user_id))
    }
  }, [dispatch, user])

  useEffect(() => {
    if (selectedTicket && showMessagesModal) {
      dispatch(fetchMessagesByTicketId(selectedTicket.ticket_id))
    }
    return () => {
      if (!showMessagesModal) {
        dispatch(clearMessages())
      }
    }
  }, [selectedTicket, showMessagesModal, dispatch])

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      await dispatch(createTicket({
        user_id: user.user_id,
        subject: newTicket.subject,
        description: newTicket.description,
        status: 'Open'
      })).unwrap()

      toast.success('Support ticket created successfully')
      setShowCreateModal(false)
      setNewTicket({ subject: '', description: '' })
    } catch (error) {
      toast.error('Failed to create support ticket')
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedTicket || !user) {
      toast.error('Please enter a message')
      return
    }

    try {
      await dispatch(sendMessage({
        ticket_id: selectedTicket.ticket_id,
        sender_id: user.user_id,
        content: newMessage.trim()
      })).unwrap()
      
      toast.success('Message sent successfully')
      setNewMessage('')
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  const openMessagesModal = (ticket: any) => {
    setSelectedTicket(ticket)
    setShowMessagesModal(true)
  }

  const closeMessagesModal = () => {
    setShowMessagesModal(false)
    setSelectedTicket(null)
    dispatch(clearMessages())
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <AlertCircle className="h-4 w-4 text-red-600" data-test="status-icon-open" />
      case 'In Progress': return <Clock className="h-4 w-4 text-yellow-600" data-test="status-icon-in-progress" />
      case 'Closed': return <CheckCircle className="h-4 w-4 text-green-600" data-test="status-icon-closed" />
      default: return <AlertCircle className="h-4 w-4" data-test="status-icon-default" />
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

  const isUserMessage = (senderId: number) => {
    return senderId === user?.user_id
  }

  return (
    <div className="space-y-6" data-test="support-center-page">
      {/* Header */}
      <div className="flex justify-between items-center" data-test="support-header">
        <h1 className="text-2xl font-bold text-gray-900" data-test="support-title">Support Center</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          data-test="new-ticket-button"
        >
          <Plus className="h-4 w-4" data-test="plus-icon" />
          New Ticket
        </button>
      </div>

      {/* Search */}
      <div className="relative" data-test="support-search">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" data-test="search-icon" />
        <input
          type="text"
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          data-test="search-input"
        />
      </div>

      {/* Tickets List */}
      <div className="space-y-4" data-test="tickets-list">
        {filteredTickets.map((ticket) => (
          <div key={ticket.ticket_id} className="bg-white rounded-lg shadow p-4 hover:shadow-md" data-test="ticket-card" data-ticket-id={ticket.ticket_id}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1" data-test="ticket-subject">{ticket.subject}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2" data-test="ticket-description">{ticket.description}</p>
                <div className="flex items-center text-xs text-gray-500 gap-4" data-test="ticket-meta">
                  <div className="flex items-center gap-1" data-test="ticket-date">
                    <Calendar className="h-3 w-3" data-test="calendar-icon" />
                    {new Date(ticket.created_at!).toLocaleDateString()}
                  </div>
                  <span data-test="ticket-id">#{ticket.ticket_id}</span>
                </div>
              </div>
              <div className="flex items-center gap-2" data-test="ticket-actions">
                <div className="flex items-center gap-1 text-sm" data-test="ticket-status">
                  {getStatusIcon(ticket.status)}
                  <span data-test="status-text">{ticket.status}</span>
                </div>
                <button
                  onClick={() => openMessagesModal(ticket)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                  title="View Messages"
                  data-test="view-messages-button"
                >
                  <MessageCircle className="h-4 w-4" data-test="message-icon" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTickets.length === 0 && !loading && (
        <div className="text-center py-12" data-test="no-tickets">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" data-test="no-tickets-icon" />
          <h3 className="text-lg font-medium text-gray-900 mb-2" data-test="no-tickets-title">No tickets found</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            data-test="create-first-ticket-button"
          >
            Create Your First Ticket
          </button>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-test="create-ticket-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-md" data-test="create-ticket-modal-content">
            <h3 className="text-lg font-semibold mb-4" data-test="create-ticket-title">Create Support Ticket</h3>
            
            <form onSubmit={handleCreateTicket} className="space-y-4" data-test="create-ticket-form">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" data-test="subject-label">Subject</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of your issue"
                  required
                  data-test="subject-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" data-test="description-label">Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Please provide detailed information..."
                  required
                  data-test="description-input"
                />
              </div>

              <div className="flex gap-3" data-test="create-ticket-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  data-test="cancel-create-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  data-test="submit-ticket-button"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Messages Modal */}
      {showMessagesModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-test="messages-modal">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col" data-test="messages-modal-content">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b" data-test="messages-modal-header">
              <div>
                <h3 className="text-lg font-semibold" data-test="messages-modal-title">Ticket #{selectedTicket.ticket_id}</h3>
                <p className="text-sm text-gray-600" data-test="messages-modal-subject">{selectedTicket.subject}</p>
              </div>
              <button 
                onClick={closeMessagesModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
                data-test="messages-modal-close"
              >
                ×
              </button>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" data-test="messages-list">
              {messagesLoading ? (
                <div className="flex justify-center py-8" data-test="messages-loading">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" data-test="loading-spinner"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500" data-test="no-messages">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" data-test="no-messages-icon" />
                  <p data-test="no-messages-text">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.message_id}
                    className={`flex ${isUserMessage(message.sender_id) ? 'justify-end' : 'justify-start'}`}
                    data-test="message-item"
                    data-message-id={message.message_id}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isUserMessage(message.sender_id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                      data-test={isUserMessage(message.sender_id) ? 'user-message' : 'support-message'}
                    >
                      <div className="flex items-center mb-1" data-test="message-sender">
                        {isUserMessage(message.sender_id) ? (
                          <User className="h-3 w-3 mr-1" data-test="user-icon" />
                        ) : (
                          <Users className="h-3 w-3 mr-1" data-test="support-icon" />
                        )}
                        <span className="text-xs opacity-75" data-test="sender-label">
                          {isUserMessage(message.sender_id) ? 'You' : 'Support'}
                        </span>
                      </div>
                      <p className="text-sm" data-test="message-content">{message.content}</p>
                      <div className="text-[10px] text-right opacity-60 mt-1" data-test="message-time">
                        {formatMessageTime(message.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-4 border-t" data-test="message-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                data-test="message-input"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                title="Send Message"
                data-test="send-message-button"
              >
                <Send className="h-5 w-5" data-test="send-icon" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupportCenter