import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { eventsAPI } from '../../services/api'

// Types
interface Event {
  event_id: number
  title: string
  description?: string
  venue_id: number
  category: string
  date: string
  time: string
  image_url?: string
  ticket_price: number
  tickets_total: number
  tickets_sold: number
  created_at?: string
  updated_at?: string
}

interface EventState {
  events: Event[]
  loading: boolean
  error: string | null
}

const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
}

// Thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventsAPI.getAll()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch events')
    }
  }
)

export const createEvent = createAsyncThunk(
  'events/create',
  async (eventData: any, { rejectWithValue }) => {
    try {
      const response = await eventsAPI.create(eventData)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue('Admin access required to create events')
      }
      if (error.response?.status === 401) {
        return rejectWithValue('Please login as admin to create events')
      }
      return rejectWithValue(error.response?.data?.error || 'Failed to create event')
    }
  }
)

export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ id, eventData }: { id: number; eventData: any }, { rejectWithValue }) => {
    try {
      const response = await eventsAPI.update(id, eventData)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue('Admin access required to update events')
      }
      if (error.response?.status === 401) {
        return rejectWithValue('Please login as admin to update events')
      }
      return rejectWithValue(error.response?.data?.error || 'Failed to update event')
    }
  }
)

export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await eventsAPI.delete(id)
      return id
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue('Admin access required to delete events')
      }
      if (error.response?.status === 401) {
        return rejectWithValue('Please login as admin to delete events')
      }
      return rejectWithValue(error.response?.data?.error || 'Failed to delete event')
    }
  }
)

// Slice
const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events.push(action.payload)
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false
        const index = state.events.findIndex(
          (event) => event.event_id === action.payload.event_id
        )
        if (index !== -1) {
          state.events[index] = action.payload
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events = state.events.filter(
          (event) => event.event_id !== action.payload
        )
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = eventSlice.actions
export default eventSlice.reducer
