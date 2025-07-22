import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/usersSlice'
import eventReducer from './slices/eventSlice'
import bookingReducer from './slices/bookingSlice'
import venueReducer from './slices/venueSlice'
import paymentReducer from './slices/paymentSlice'
import supportTicketReducer from './slices/supportTicketSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    events: eventReducer,
    bookings: bookingReducer,
    venues: venueReducer,
    payments: paymentReducer,
    supportTickets: supportTicketReducer,
    
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
