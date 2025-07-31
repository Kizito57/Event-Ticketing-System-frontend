import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { type AppDispatch, type RootState } from '../../store/store'
import EventBrowsing from './customer/EventBrowsing'
import MyBookings from './customer/MyBookings'
import MyPayments from './customer/MyPayments'
import SupportCenter from './customer/SupportCenter'
import Profile from './customer/Profile'
import { toast } from 'sonner'
import {
  CalendarCheck2, User, LogOut, 
  ChevronLeft, ChevronRight,
  Ticket, CreditCard, HelpCircle, 
  DiamondIcon
} from 'lucide-react'

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('events')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully.')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return <EventBrowsing />
      case 'bookings':
        return <MyBookings />
      case 'payments':
        return <MyPayments />
      case 'support':
        return <SupportCenter />
      case 'profile':
        return <Profile />
      default:
        return <EventBrowsing />
    }
  }

  const menuItems = [
    { 
      id: 'events', 
      label: 'Discover Events', 
      icon: Ticket, 
      color: 'text-emerald-500',
      description: 'Find your perfect event to enjoy'
    },
    { 
      id: 'bookings', 
      label: 'Bookings', 
      icon: CalendarCheck2, 
      color: 'text-blue-500',
      description: 'View your bookings'
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      color: 'text-yellow-500',
      description: 'View payment history'
    },
    {
      id: 'support',
      label: 'Support',
      icon: HelpCircle,
      color: 'text-red-500',
      description: 'Need help? Contact us'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      color: 'text-purple-500',
      description: 'Manage your account'
    },
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon' 
    return 'Good Evening'
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-cyan-50" data-test="user-dashboard">
      {/* Enhanced Sidebar */}
      <aside
        className={`transition-all duration-300 ease-in-out bg-white/90 backdrop-blur-lg shadow-xl border-r border-emerald-100 ${
          sidebarOpen ? 'w-80' : 'w-20'
        } min-h-screen relative`}
        data-test="sidebar"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-emerald-100" data-test="sidebar-header">
          <div className="flex items-center justify-between" data-test="sidebar-header-content">
            {sidebarOpen && (
              <div className="flex items-center gap-3" data-test="sidebar-brand">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-green-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg" data-test="brand-logo-container">
                  <DiamondIcon className="w-6 h-6 text-white" data-test="brand-logo" />
                </div>
                <div data-test="brand-text">
                  <h3 className="font-bold text-gray-800 text-lg" data-test="brand-name">Crystal Events</h3>
                  <p className="text-sm text-gray-500" data-test="brand-slogan">Your journey starts here</p>
                </div>
              </div>
            )}
            <button
              className="btn btn-sm btn-ghost hover:bg-indigo-50 transition-colors rounded-xl"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-test="sidebar-toggle"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-5 h-5 text-gray-600" data-test="sidebar-collapse-icon" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" data-test="sidebar-expand-icon" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-6" data-test="sidebar-nav">
          <ul className="space-y-3" data-test="nav-menu">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id} data-test={`nav-item-${item.id}`}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-green-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-800'
                    }`}
                    data-test={`nav-button-${item.id}`}
                  >
                    <Icon 
                      className={`w-6 h-6 transition-all duration-200 ${
                        activeTab === item.id ? 'text-white' : item.color
                      }`} 
                      data-test={`nav-icon-${item.id}`}
                    />
                    {sidebarOpen && (
                      <div className="flex flex-col items-start" data-test={`nav-text-${item.id}`}>
                        <span className="font-semibold text-base" data-test={`nav-label-${item.id}`}>{item.label}</span>
                        <span className={`text-xs ${
                          activeTab === item.id ? 'text-blue-100' : 'text-gray-400'
                        }`} data-test={`nav-description-${item.id}`}>
                          {item.description}
                        </span>
                      </div>
                    )}
                    {activeTab === item.id && sidebarOpen && (
                      <div className="ml-auto" data-test={`nav-active-indicator-${item.id}`}>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Profile & Logout */}
        <div className="absolute bottom-6 left-6 right-6" data-test="sidebar-footer">
          <button 
            onClick={handleLogout} 
            className={`btn border-blue-100 text-green-500 hover:bg-emerald-50 hover:border-emerald-200 w-full transition-all duration-200 rounded-xl ${
              !sidebarOpen ? 'btn-square' : 'bg-green-50/50'
            }`}
            data-test="logout-button"
          >
            <LogOut className="w-5 h-5" data-test="logout-icon" />
            {sidebarOpen && <span className="ml-2 font-medium" data-test="logout-label">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden" data-test="main-content">
        {/* Enhanced Header */}
        <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-indigo-100 px-8 py-6" data-test="header">
          <div className="flex items-center justify-between" data-test="header-content">
            <div data-test="header-greeting">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-cyan-600 bg-clip-text text-transparent" data-test="greeting-text">
                {getGreeting()}, {user?.first_name}!
              </h1>
              <p className="text-gray-500 mt-1 text-lg" data-test="greeting-subtext">
                Ready for your next adventure?
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto" data-test="content-area">
          <div className="p-8" data-test="content-container">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-indigo-100 min-h-full relative overflow-hidden" data-test="content-card">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100 to-green-100 rounded-full -translate-y-32 translate-x-32 opacity-30" data-test="decorative-top"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100 to-yellow-100 rounded-full translate-y-24 -translate-x-24 opacity-30" data-test="decorative-bottom"></div>
              
              <div className="relative z-10 p-8" data-test="content-render">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserDashboard