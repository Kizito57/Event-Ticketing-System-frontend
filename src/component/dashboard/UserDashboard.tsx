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
    }
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-cyan-50">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 ease-in-out bg-white/90 backdrop-blur-lg shadow-xl border-r border-emerald-100 ${
          sidebarOpen ? 'w-80' : 'w-20'
        } min-h-screen relative`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-emerald-100">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-green-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <DiamondIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Crystal Events</h3>
                  <p className="text-sm text-gray-500">Your journey starts here</p>
                </div>
              </div>
            )}
            <button
              data-test="sidebar-toggle"
              className="btn btn-sm btn-ghost hover:bg-indigo-50 transition-colors rounded-xl"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-6">
          <ul className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    data-test={`menu-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-green-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-800'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 transition-all duration-200 ${
                        activeTab === item.id ? 'text-white' : item.color
                      }`}
                    />
                    {sidebarOpen && (
                      <div className="flex flex-col items-start">
                        <span className="font-semibold text-base">{item.label}</span>
                        <span className={`text-xs ${
                          activeTab === item.id ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {item.description}
                        </span>
                      </div>
                    )}
                    {activeTab === item.id && sidebarOpen && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            data-test="logout-button"
            onClick={handleLogout}
            className={`btn border-blue-100 text-green-500 hover:bg-emerald-50 hover:border-emerald-200 w-full transition-all duration-200 rounded-xl ${
              !sidebarOpen ? 'btn-square' : 'bg-green-50/50'
            }`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="ml-2 font-medium">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-indigo-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1
                data-test="greeting"
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-cyan-600 bg-clip-text text-transparent"
              >
                {getGreeting()}, {user?.first_name}!
              </h1>
              <p className="text-gray-500 mt-1 text-lg">
                Ready for your next adventure?
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div
              data-test="dashboard-content"
              className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-indigo-100 min-h-full relative overflow-hidden"
            >
              {/* Decorative Blobs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100 to-green-100 rounded-full -translate-y-32 translate-x-32 opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100 to-yellow-100 rounded-full translate-y-24 -translate-x-24 opacity-30"></div>
              <div className="relative z-10 p-8">{renderContent()}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserDashboard
