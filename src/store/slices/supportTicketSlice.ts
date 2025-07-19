import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supportTicketsAPI } from '../../services/api'

interface SupportTicket {
  ticket_id: number
  user_id: number
  subject: string
  description: string
  status: string
  created_at?: string
  updated_at?: string
}

interface SupportTicketState {
  tickets: SupportTicket[]
  loading: boolean
  error: string | null
}

const initialState: SupportTicketState = {
  tickets: [],
  loading: false,
  error: null,
}

export const fetchTickets = createAsyncThunk('supportTickets/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await supportTicketsAPI.getAll()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch support tickets')
  }
})

export const createTicket = createAsyncThunk(
  'supportTickets/create',
  async (ticketData: any, { rejectWithValue }) => {
    try {
      const response = await supportTicketsAPI.create(ticketData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create ticket')
    }
  }
)

export const updateTicket = createAsyncThunk(
  'supportTickets/update',
  async ({ id, ticketData }: { id: number; ticketData: any }, { rejectWithValue }) => {
    try {
      const response = await supportTicketsAPI.update(id, ticketData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update ticket')
    }
  }
)

export const deleteTicket = createAsyncThunk('supportTickets/delete', async (id: number, { rejectWithValue }) => {
  try {
    await supportTicketsAPI.delete(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete ticket')
  }
})

const supportTicketSlice = createSlice({
  name: 'supportTickets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false
        state.tickets = action.payload
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false
        state.tickets.push(action.payload)
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex((t) => t.ticket_id === action.payload.ticket_id)
        if (index !== -1) {
          state.tickets[index] = action.payload
        }
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter((t) => t.ticket_id !== action.payload)
      })
  },
})

export const { clearError } = supportTicketSlice.actions
export default supportTicketSlice.reducer
