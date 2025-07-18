import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/usersSlice'
// import eventReducer from './slices/carSlice'
import bookingReducer from './slices/bookingSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    // events: eventReducer,
    bookings: bookingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch