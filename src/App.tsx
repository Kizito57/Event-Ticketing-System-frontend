import { Routes, Route, Navigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { type RootState } from './store/store'
import { Toaster } from 'sonner'

import Login from './component/auth/Login'
import Register from './component/auth/Register'
import Verification from './component/auth/Verification'
// import AdminDashboard from './component/dashboard/AdminDashboard'
// import CustomerDashboard from './component/dashboard/CustomerDashboard'

import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
// import Dashboard from './component/dashboard/Dashboard'
import Error from './component/error/Error'
import Navbar from './component/nav/Navbar'

function App() {
//   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  return (
    <div className="min-h-screen bg-base-200">
      <Toaster position="top-right" richColors />
      <Navbar />
      
      {/* Main content area */}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/about" element={<AboutPage />} />

        {/* <Route 
          path="/admin-dashboard" 
          element={
            isAuthenticated && user?.role === 'admin' ? 
              <AdminDashboard /> : 
              <Navigate to="/login" />
          } 
        /> */}

        {/* <Route 
          path="/customer-dashboard" 
          element={
            isAuthenticated && user?.role === 'customer' ? 
              <CustomerDashboard /> : 
              <Navigate to="/login" />
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
          }
        >
          <Route path="main" element={<h1>Analytics</h1>} />
          <Route path="todos" element={<h1>Todos</h1>} />
          <Route path="profile" element={<h1>Profile</h1>} />
        </Route> */}

        <Route 
          path="/" 
          // element={
          //   isAuthenticated ? 
          //     user?.role === 'admin' ? 
          //       <Navigate to="/admin-dashboard" /> : 
          //       <Navigate to="/customer-dashboard" />
          //     : <LandingPage />
          // } 
          element={<LandingPage />}
        />

        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  )
}

export default App
