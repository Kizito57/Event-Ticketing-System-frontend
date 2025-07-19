import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { venuesAPI } from '../../services/api'

// Types
interface Venue {
  venue_id: number
  name: string
  address: string
  capacity: number
  image_url?: string
  created_at?: string
  updated_at?: string
}

interface VenueState {
  venues: Venue[]
  loading: boolean
  error: string | null
}

const initialState: VenueState = {
  venues: [],
  loading: false,
  error: null,
}

// Thunks
export const fetchVenues = createAsyncThunk('venues/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await venuesAPI.getAll()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch venues')
  }
})

export const createVenue = createAsyncThunk(
  'venues/create',
  async (venueData: any, { rejectWithValue }) => {
    try {
      const response = await venuesAPI.create(venueData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create venue')
    }
  }
)

export const updateVenue = createAsyncThunk(
  'venues/update',
  async ({ id, venueData }: { id: number; venueData: any }, { rejectWithValue }) => {
    try {
      const response = await venuesAPI.update(id, venueData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update venue')
    }
  }
)

export const deleteVenue = createAsyncThunk('venues/delete', async (id: number, { rejectWithValue }) => {
  try {
    await venuesAPI.delete(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete venue')
  }
})

const venueSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVenues.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.loading = false
        state.venues = action.payload
      })
      .addCase(fetchVenues.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createVenue.fulfilled, (state, action) => {
        state.loading = false
        state.venues.push(action.payload)
      })
      .addCase(updateVenue.fulfilled, (state, action) => {
        const index = state.venues.findIndex((v) => v.venue_id === action.payload.venue_id)
        if (index !== -1) {
          state.venues[index] = action.payload
        }
      })
      .addCase(deleteVenue.fulfilled, (state, action) => {
        state.venues = state.venues.filter((v) => v.venue_id !== action.payload)
      })
  },
})

export const { clearError } = venueSlice.actions
export default venueSlice.reducer
