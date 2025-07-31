// Login.tsx
import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { FaTicketAlt, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaShieldAlt } from 'react-icons/fa'
import { type AppDispatch, type RootState } from '../../store/store'
import { loginUser, clearError } from '../../store/slices/authSlice'

type LoginInputs = {
  email: string
  password: string
}

const schema = yup.object({
  email: yup.string().email('Invalid email').max(100).required('Email is required'),
  password: yup.string().min(6).max(255).required('Password is required'),
})

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isAuthenticated, user, error, loading } = useSelector((state: RootState) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: yupResolver(schema),
  })

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap()
      toast.success('Welcome back! Login successful!')
    } catch {
      toast.error('Login failed. Please check your credentials.')
    }
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'
      navigate(redirectPath)
    }
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center px-4 py-8" data-test="login-page">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-gray-100" data-test="login-container">
          <div className="text-center mb-8" data-test="login-header">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FaTicketAlt className="text-emerald-600 text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" data-test="login-title">Welcome Back</h1>
            <p className="text-gray-600" data-test="login-subtitle">Sign in to access your Crystal Events account</p>
          </div>

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
              data-test="login-error"
            >
              <FaShieldAlt className="text-red-500" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" data-test="login-form">
            <div className="form-control" data-test="email-field">
              <label className="label">
                <span className="label-text font-medium text-gray-700" data-test="email-label">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter your email"
                  data-test="login-email-input"
                />
              </div>
              {errors.email && (
                <span className="text-sm text-red-600 mt-1 flex items-center gap-1" data-test="email-error">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="form-control" data-test="password-field">
              <label className="label">
                <span className="label-text font-medium text-gray-700" data-test="password-label">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="Enter your password"
                  data-test="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  data-test="toggle-password-visibility"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors.password && (
                <span className="text-sm text-red-600 mt-1 flex items-center gap-1" data-test="password-error">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between" data-test="login-options">
              <label className="flex items-center gap-2 cursor-pointer" data-test="remember-me">
                <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" data-test="remember-me-checkbox" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-green-600 hover:text-emerald-700"
                data-test="forgot-password-link"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className={`btn w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white border-0 py-3 rounded-lg font-medium transition-all duration-200 ${
                loading ? 'loading' : ''
              }`}
              disabled={loading}
              data-test="login-submit-button"
            >
              {loading ? (
                <span className="flex items-center gap-2" data-test="loading-state">
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FaUser />
                  Sign In
                </span>
              )}
            </button>
          </form>

          <div className="text-center mt-8 space-y-3" data-test="login-footer">
            <p className="text-gray-600">
              New to Crystal Events?{' '}
              <a href="/register" className="text-green-600 hover:text-emerald-700 font-medium" data-test="register-link">
                Create an account
              </a>
            </p>
            <p>
              <a href="/" className="text-gray-500 hover:text-gray-700 text-sm" data-test="back-home-link">
                ← Back to Home
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login