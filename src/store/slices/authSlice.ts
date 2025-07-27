import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { authAPI } from '../../services/api'

// Types
interface User {
  user_id: number
  first_name: string
  last_name: string
  email: string
  role: 'admin' | 'user'
  is_verified: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  registrationEmail: string | null
}

interface RegisterPayload {
  first_name: string
  last_name: string
  email: string
  password: string
}

interface LoginPayload {
  email: string
  password: string
}

interface VerificationPayload {
  email: string
  verification_code: string
}

// Load from localStorage
const tokenFromStorage = localStorage.getItem('token')
const userFromStorage = localStorage.getItem('user')
const parsedUser = userFromStorage ? JSON.parse(userFromStorage) : null

const initialState: AuthState = {
  user: parsedUser,
  token: tokenFromStorage,
  isAuthenticated: !!tokenFromStorage && !!parsedUser,
  loading: false,
  error: null,
  registrationEmail: null,
}

// Thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.error || 'Registration failed')
    }
  }
)

export const verifyEmail = createAsyncThunk(
  'auth/verify',
  async ({ email, verification_code }: VerificationPayload, { rejectWithValue }) => {
    try {
      const response = await authAPI.verify(email, verification_code)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.error || 'Verification failed')
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password)
      const user = response.data.user || response.data.admin || null
      return {
        token: response.data.token,
        user,
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.error || 'Login failed')
    }
  }
)

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError: (state) => {
      state.error = null
    },
    setRegistrationEmail: (state, action: PayloadAction<string>) => {
      state.registrationEmail = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.registrationEmail = action.payload.user?.email || action.payload.admin?.email || null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Verify
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false
        state.registrationEmail = null
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = !!state.user && !!state.token

        if (state.user && state.token) {
          localStorage.setItem('user', JSON.stringify(state.user))
          localStorage.setItem('token', state.token)
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError, setRegistrationEmail } = authSlice.actions
export default authSlice.reducer
