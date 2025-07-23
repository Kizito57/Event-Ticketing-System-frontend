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

  // Fetch messages when a ticket is selected for messaging
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
      case 'Open': return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'In Progress': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'Closed': return <CheckCircle className="h-4 w-4 text-green-600" />
      default: return <AlertCircle className="h-4 w-4" />
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div key={ticket.ticket_id} className="bg-white rounded-lg shadow p-4 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{ticket.subject}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{ticket.description}</p>
                <div className="flex items-center text-xs text-gray-500 gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(ticket.created_at!).toLocaleDateString()}
                  </div>
                  <span>#{ticket.ticket_id}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm">
                  {getStatusIcon(ticket.status)}
                  {ticket.status}
                </div>
                <button
                  onClick={() => openMessagesModal(ticket)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                  title="View Messages"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTickets.length === 0 && !loading && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Your First Ticket
          </button>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Support Ticket</h3>
            
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Please provide detailed information..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">Ticket #{selectedTicket.ticket_id}</h3>
                <p className="text-sm text-gray-600">{selectedTicket.subject}</p>
              </div>
              <button 
                onClick={closeMessagesModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.message_id}
                    className={`flex ${isUserMessage(message.sender_id) ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isUserMessage(message.sender_id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {isUserMessage(message.sender_id) ? (
                          <User className="h-3 w-3 mr-1" />
                        ) : (
                          <Users className="h-3 w-3 mr-1" />
                        )}
                        <span className="text-xs opacity-75">
                          {isUserMessage(message.sender_id) ? 'You' : 'Support'}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <div className="text-[10px] text-right opacity-60 mt-1">
                        {formatMessageTime(message.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-4 border-t">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                title="Send Message"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupportCenter
