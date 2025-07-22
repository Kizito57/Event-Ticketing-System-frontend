import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { bookingAPI } from '../../services/api'

interface Booking {
  booking_id: number
  user_id: number
  event_id: number
  quantity: number
  total_amount: number
  booking_status: string
  created_at: string
  updated_at: string
}

interface BookingState {
  bookings: Booking[]
  loading: boolean
  error: string | null
}

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
}

// Fetch all bookings
export const fetchBookings = createAsyncThunk(
  'bookings/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.getAll()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch bookings')
    }
  }
)

// Fetch all bookings by user id
export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchByUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.getByUserId(userId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch your bookings')
    }
  }
)

// Create new booking
export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData: Omit<Booking, 'booking_id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.create(bookingData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create booking')
    }
  }
)

// Update booking
export const updateBooking = createAsyncThunk(
  'bookings/update',
  async ({ id, data }: { id: number; data: Partial<Booking> }, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.update(id, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update booking')
    }
  }
)

// Update booking status (specifically for payment confirmation)
export const updateBookingStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ bookingId, status }: { bookingId: number; status: string }, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.update(bookingId, { booking_status: status })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update booking status')
    }
  }
)

// Delete booking
export const deleteBooking = createAsyncThunk(
  'bookings/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await bookingAPI.delete(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete booking')
    }
  }
)

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    // Local state update for immediate UI feedback
    updateBookingStatusLocal: (state, action) => {
      const { bookingId, status } = action.payload
      const booking = state.bookings.find(b => b.booking_id === bookingId)
      if (booking) {
        booking.booking_status = status
        booking.updated_at = new Date().toISOString()
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false
        state.bookings.push(action.payload)
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Update booking
      .addCase(updateBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false
        const index = state.bookings.findIndex(booking => booking.booking_id === action.payload.booking_id)
        if (index !== -1) {
          state.bookings[index] = action.payload
        }
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Update booking status (for payment confirmation)
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = false // Don't show loading for status updates
        state.error = null
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false
        const index = state.bookings.findIndex(booking => booking.booking_id === action.payload.booking_id)
        if (index !== -1) {
          state.bookings[index] = action.payload
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Delete booking
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = state.bookings.filter(booking => booking.booking_id !== action.payload)
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setLoading, updateBookingStatusLocal } = bookingSlice.actions
export default bookingSlice.reducer