import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { paymentsAPI } from '../../services/api'

interface Payment {
  payment_id: number
  booking_id: number
  amount: number
  payment_status: string
  payment_date: string
  payment_method?: string
  transaction_id?: string
  created_at?: string
  updated_at?: string
}

interface PaymentState {
  payments: Payment[]
  loading: boolean
  error: string | null
}

const initialState: PaymentState = {
  payments: [],
  loading: false,
  error: null,
}

export const fetchPayments = createAsyncThunk('payments/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await paymentsAPI.getAll()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch payments')
  }
})

export const createPayment = createAsyncThunk(
  'payments/create',
  async (paymentData: any, { rejectWithValue }) => {
    try {
      const response = await paymentsAPI.create(paymentData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create payment')
    }
  }
)

export const updatePayment = createAsyncThunk(
  'payments/update',
  async ({ id, paymentData }: { id: number; paymentData: any }, { rejectWithValue }) => {
    try {
      const response = await paymentsAPI.update(id, paymentData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update payment')
    }
  }
)

export const deletePayment = createAsyncThunk('payments/delete', async (id: number, { rejectWithValue }) => {
  try {
    await paymentsAPI.delete(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete payment')
  }
})

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false
        state.payments = action.payload
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false
        state.payments.push(action.payload)
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        const index = state.payments.findIndex((p) => p.payment_id === action.payload.payment_id)
        if (index !== -1) {
          state.payments[index] = action.payload
        }
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter((p) => p.payment_id !== action.payload)
      })
  },
})

export const { clearError } = paymentSlice.actions
export default paymentSlice.reducer
