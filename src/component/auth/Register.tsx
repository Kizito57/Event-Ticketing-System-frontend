import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { type AppDispatch, type RootState } from '../../store/store'
import { registerUser, clearError, setRegistrationEmail } from '../../store/slices/authSlice'

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    const { confirmPassword, ...registrationData } = formData
    const result = await dispatch(registerUser(registrationData))

    if (registerUser.fulfilled.match(result)) {
      dispatch(setRegistrationEmail(formData.email))
      navigate('/verify')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center p-4" data-test="register-page">
      <div className="w-full max-w-md" data-test="register-container">

        {/* Header */}
        <div className="text-center mb-8" data-test="register-header">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-green-600 rounded-2xl mb-4 shadow-lg" data-test="register-icon">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2" data-test="register-title">Create Account</h1>
          <p className="text-gray-600" data-test="register-subtitle">Join us and start your journey</p>
        </div>

        {/* Card */}
        <div className="card bg-white/80 backdrop-blur-sm shadow-xl border border-white/20" data-test="register-card">
          <div className="card-body p-8" data-test="register-form">

            {error && (
              <div className="alert alert-error mb-6" data-test="register-error">
                <svg
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" data-test="register-form-element">

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4" data-test="name-fields">
                <div className="form-control" data-test="first-name-field">
                  <label className="label">
                    <span className="label-text text-gray-700 font-medium" data-test="first-name-label">First Name</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="input input-bordered bg-white/50 border-gray-200 focus:border-emerald-400 focus:bg-white transition-all duration-200"
                    placeholder="John"
                    required
                    data-test="register-first-name"
                  />
                </div>

                <div className="form-control" data-test="last-name-field">
                  <label className="label">
                    <span className="label-text text-gray-700 font-medium" data-test="last-name-label">Last Name</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="input input-bordered bg-white/50 border-gray-200 focus:border-emerald-400 focus:bg-white transition-all duration-200"
                    placeholder="Doe"
                    required
                    data-test="register-last-name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="form-control" data-test="email-field">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium" data-test="email-label">Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered bg-white/50 border-gray-200 focus:border-emerald-400 focus:bg-white transition-all duration-200"
                  placeholder="john@gmail.com"
                  required
                  data-test="register-email"
                />
              </div>

              {/* Password Field */}
              <div className="form-control" data-test="password-field">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium" data-test="password-label">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered bg-white/50 border-gray-200 focus:border-emerald-400 focus:bg-white transition-all duration-200"
                  placeholder="••••••••"
                  required
                  data-test="register-password"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="form-control" data-test="confirm-password-field">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium" data-test="confirm-password-label">Confirm Password</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input input-bordered bg-white/50 border-gray-200 focus:border-blue-400 focus:bg-white transition-all duration-200"
                  placeholder="••••••••"
                  required
                  data-test="register-confirm-password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`btn btn-primary w-full bg-gradient-to-r from-yellow-500 to-green-600 border-none text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${
                  loading ? 'loading' : ''
                }`}
                disabled={loading}
                data-test="register-submit-button"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" data-test="register-loading-state"></span>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider text-gray-400 my-6" data-test="register-divider">Already have an account?</div>

            {/* Login Link */}
            <div className="text-center" data-test="login-link-section">
              <Link
                to="/login"
                className="btn btn-ghost text-green-600 hover:text-yellow-700 hover:bg-emerald-50 transition-colors duration-200"
                data-test="register-login-link"
              >
                Sign In Instead
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500" data-test="register-footer">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  )
}

export default Register