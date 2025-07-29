import logo from '../../assets/images/logo.jpg'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { type RootState, type AppDispatch } from '../../store/store'
import { logout } from '../../store/slices/authSlice'
import { toast } from 'sonner'
import {
  Home,
  Info,
  BarChart3,
  UserPlus,
  LogIn,
  Menu,
  LogOut,
} from 'lucide-react'

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/')
  }

  const getDashboardPath = () =>
    user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'

  const isDashboardPage =
    location.pathname.includes('/admin-dashboard') ||
    location.pathname.includes('/user-dashboard') ||
    location.pathname.includes('/dashboard')

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-slate-50/90 to-white/90 border-b border-slate-200/50">
      <div className="navbar max-w-7xl mx-auto px-4">
        {/* Navbar Start (Logo + Dropdown on mobile) */}
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden hover:bg-slate-100/80 rounded-xl"
              data-test="navbar-menu-button"
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </div>
            <ul className="menu menu-sm dropdown-content rounded-2xl z-50 mt-3 w-64 p-3 shadow-2xl bg-white/95 backdrop-blur-lg border border-slate-200/50">
              <li>
                <NavLink to="/" className="menu-item" data-test="nav-home-mobile">
                  <Home className="w-5 h-5" /> Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="menu-item" data-test="nav-about-mobile">
                  <Info className="w-5 h-5" /> About
                </NavLink>
              </li>
              <li>
                <NavLink to={getDashboardPath()} className="menu-item" data-test="nav-dashboard-mobile">
                  <BarChart3 className="w-5 h-5" /> Dashboard
                </NavLink>
              </li>
              <div className="divider my-2"></div>
              {!isAuthenticated ? (
                <>
                  <li>
                    <NavLink to="/register" className="menu-item" data-test="nav-register-mobile">
                      <UserPlus className="w-5 h-5" /> Register
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/login" className="menu-item" data-test="nav-login-mobile">
                      <LogIn className="w-5 h-5" /> Login
                    </NavLink>
                  </li>
                </>
              ) : (
                !isDashboardPage && (
                  <li>
                    <button
                      onClick={handleLogout}
                      className="menu-item text-red-600"
                      data-test="nav-logout-mobile"
                    >
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Logo */}
          <div className="flex items-center ml-2 lg:ml-8" data-test="navbar-logo">
            <img src={logo} alt="Logo" className="w-14 h-14 rounded-xl bg-white p-1" />
            <span className="ml-3 font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-emerald-600 hidden sm:block">
              Crytsal Events
            </span>
          </div>
        </div>

        {/* Navbar Center (Desktop Links) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li>
              <NavLink to="/" className="menu-item" data-test="nav-home-desktop">
                <Home className="w-4 h-4" /> Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="menu-item" data-test="nav-about-desktop">
                <Info className="w-4 h-4" /> About
              </NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink to={getDashboardPath()} className="menu-item" data-test="nav-dashboard-desktop">
                  <BarChart3 className="w-4 h-4" /> Dashboard
                </NavLink>
              </li>
            )}
          </ul>
        </div>

        {/* Navbar End (Actions) */}
        <div className="navbar-end hidden lg:flex gap-3">
          {!isAuthenticated ? (
            <>
              <NavLink
                to="/register"
                className="btn btn-outline btn-sm border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                data-test="nav-register-desktop"
              >
                <UserPlus className="w-4 h-4 mr-1" /> Register
              </NavLink>
              <NavLink
                to="/login"
                className="btn btn-sm bg-emerald-500 text-white hover:bg-emerald-600"
                data-test="nav-login-desktop"
              >
                <LogIn className="w-4 h-4 mr-1" /> Login
              </NavLink>
            </>
          ) : (
            !isDashboardPage && (
              <button
                onClick={handleLogout}
                className="btn btn-sm border border-cyan-500 text-green-600 hover:bg-green-50"
                data-test="nav-logout-desktop"
              >
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
