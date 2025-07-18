import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { type AppDispatch, type RootState } from '../../store/store'
import { verifyEmail, clearError } from '../../store/slices/authSlice'

const Verification = () => {
  const [verificationCode, setVerificationCode] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error, registrationEmail } = useSelector(
    (state: RootState) => state.auth
  )

  useEffect(() => {
    if (!registrationEmail) {
      navigate('/register')
    }
  }, [registrationEmail, navigate])

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!registrationEmail) return

    const result = await dispatch(
      verifyEmail({ email: registrationEmail, verification_code: verificationCode })
    )

    if (verifyEmail.fulfilled.match(result)) {
      navigate('/login')
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setVerificationCode(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Check Your Email</h1>
          <p className="text-gray-600">We've sent a verification code to your inbox</p>
        </div>

        {/* Card */}
        <div className="card bg-white/80 backdrop-blur-sm shadow-xl border border-white/20">
          <div className="card-body p-8">
            {/* Email Info */}
            <div className="alert alert-info mb-6 bg-blue-50 border-blue-200">
              <svg
                className="stroke-current shrink-0 h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-blue-800">Verification code sent!</p>
                <p className="text-blue-700">
                  Check your inbox at <span className="font-semibold">{registrationEmail}</span>
                </p>
              </div>
            </div>

            {error && (
              <div className="alert alert-error mb-6">
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Verification Code Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">Verification Code</span>
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  className="input input-bordered bg-white/50 border-gray-200 focus:border-purple-400 focus:bg-white transition-all duration-200 text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    Enter the 6-digit code from your email
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`btn btn-primary w-full bg-gradient-to-r from-purple-500 to-pink-600 border-none text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${
                  loading ? 'loading' : ''
                }`}
                disabled={loading || verificationCode.length !== 6}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Verify Email
                  </>
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600 space-y-2">
                <p>Didn't receive the code?</p>
                <div className="flex flex-col space-y-1">
                  <span>• Check your spam/junk folder</span>
                  <span>• Wait a few minutes and try again</span>
                  <span>• Make sure you entered the correct email</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="divider text-gray-400 my-6">Need help?</div>

            {/* Back to Register */}
            <div className="text-center">
              <button
                onClick={() => navigate('/register')}
                className="btn btn-ghost text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Registration
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Having trouble? Contact our support team for assistance
        </div>
      </div>
    </div>
  )
}

export default Verification
