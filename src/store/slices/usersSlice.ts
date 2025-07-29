import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { usersAPI } from '../../services/api'

// Types updated to match UsersTable schema
interface User {
  user_id: number
  first_name: string
  last_name: string
  email: string
  role: 'user' | 'admin'
  is_verified: boolean
  image_url?: string
}

interface UpdateUserData {
  user_id: number
  first_name?: string
  last_name?: string
  email?: string
  role?: 'user' | 'admin'
  is_verified?: boolean
  image_url?: string
}

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
  selectedUser: User | null
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
}

// READ - Fetch all users
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getAll()
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch users'
      )
    }
  }
)

// READ - Fetch single user
export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getById(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch user'
      )
    }
  }
)

// UPDATE - Update existing user
export const updateUser = createAsyncThunk(
  'users/update',
  async (userData: UpdateUserData, { rejectWithValue }) => {
    try {
      const { user_id, ...updateData } = userData
      const response = await usersAPI.update(user_id, updateData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to update user'
      )
    }
  }
)

// DELETE - Remove user
export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await usersAPI.delete(id)
      return id
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to delete user'
      )
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelectedUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedUser = action.payload
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        const index = state.users.findIndex(
          (user) => user.user_id === action.payload.user_id
        )
        if (index !== -1) {
          state.users[index] = action.payload
        }
        if (state.selectedUser?.user_id === action.payload.user_id) {
          state.selectedUser = action.payload
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.filter((user) => user.user_id !== action.payload)
        if (state.selectedUser?.user_id === action.payload) {
          state.selectedUser = null
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setSelectedUser, clearSelectedUser } = usersSlice.actions
export default usersSlice.reducer
