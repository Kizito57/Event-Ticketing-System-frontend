import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { type AppDispatch, type RootState } from '../../store/store'
import UserManagement from './admin/UserManagement'
import EventManagement from './admin/EventManagement'
import BookingManagement from './admin/BookingManagement'
import VenueManagement from './admin/VenueManagement'
import PaymentManagement from './admin/PaymentManagement'
import SupportTicketManagement from './admin/SupportTicketManagement'
import Profile from './customer/Profile'
import { toast } from 'sonner'
import {
  Users, CalendarDays, User, LogOut, Settings,
  ChevronLeft, ChevronRight, Building2, CreditCard, HelpCircle,
  Ticket
} from 'lucide-react'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully.')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />
      case 'events':
        return <EventManagement />
      case 'bookings':
        return <BookingManagement />
      case 'venues':
        return <VenueManagement />
      case 'payments':
        return <PaymentManagement />
      case 'support':
        return <SupportTicketManagement />
      case 'profile':
        return <Profile />
      default:
        return <UserManagement />
    }
  }

  const menuItems = [
    { id: 'users', label: 'Users', icon: Users, color: 'text-blue-500' },
    { id: 'events', label: 'Events', icon: Ticket, color: 'text-green-500' },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays, color: 'text-purple-500' },
    { id: 'profile', label: 'Profile', icon: User, color: 'text-orange-500' },
    { id: 'venues', label: 'Venues', icon: Building2, color: 'text-cyan-500' },
    { id: 'payments', label: 'Payments', icon: CreditCard, color: 'text-yellow-500' },
    { id: 'support', label: 'Support', icon: HelpCircle, color: 'text-red-500' },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" data-test="admin-dashboard">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 ease-in-out bg-white shadow-xl border-r border-slate-200 ${
          sidebarOpen ? 'w-72' : 'w-20'
        } min-h-screen relative`}
        data-test="admin-sidebar"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-3" data-test="sidebar-header">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Admin Panel</h3>
                  <p className="text-sm text-slate-500">Management Console</p>
                </div>
              </div>
            )}
            <button
              className="btn btn-sm btn-ghost hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-test="sidebar-toggle"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                    data-test={`sidebar-tab-${item.id}`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        activeTab === item.id ? 'text-white' : item.color
                      }`}
                    />
                    {sidebarOpen && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    {activeTab === item.id && sidebarOpen && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Profile & Logout */}
        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={handleLogout}
            className={`btn btn-outline border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 w-full transition-all duration-200 ${
              !sidebarOpen ? 'btn-square' : ''
            }`}
            data-test="sidebar-logout-button"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-6" data-test="admin-header">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
                data-test="admin-welcome-message"
              >
                Welcome back, {user?.first_name}! 👋
              </h1>
              <p className="text-slate-500 mt-1">Manage your events business efficiently</p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-slate-50/50" data-test="admin-main-content">
          <div className="p-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-full">
              <div className="p-6">{renderContent()}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
