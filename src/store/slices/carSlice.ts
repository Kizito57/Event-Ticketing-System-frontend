// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { carAPI } from '../../services/api' // Make sure this path matches your api.ts location

// interface Car {
//   carID: number
//   carModel: string
//   year: number
//   color: string
//   rentalRate: number
//   availability: boolean
//   imageUrl?: string // Add image URL field
// }

// interface CarState {
//   cars: Car[]
//   loading: boolean
//   error: string | null
// }

// const initialState: CarState = {
//   cars: [],
//   loading: false,
//   error: null,
// }

// export const fetchCars = createAsyncThunk(
//   'cars/fetchAll',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await carAPI.getAll()
//       return response.data
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch cars')
//     }
//   }
// )

// export const createCar = createAsyncThunk(
//   'cars/create',
//   async (carData: any, { rejectWithValue }) => {
//     try {
//       const response = await carAPI.create(carData)
//       return response.data
//     } catch (error: any) {
//       // Handle admin-only access error
//       if (error.response?.status === 403) {
//         return rejectWithValue('Admin access required to create cars')
//       }
//       if (error.response?.status === 401) {
//         return rejectWithValue('Please login as admin to create cars')
//       }
//       return rejectWithValue(error.response?.data?.error || 'Failed to create car')
//     }
//   }
// )

// export const updateCar = createAsyncThunk(
//   'cars/update',
//   async ({ id, carData }: { id: number; carData: any }, { rejectWithValue }) => {
//     try {
//       const response = await carAPI.update(id, carData)
//       return response.data
//     } catch (error: any) {
//       // Handle admin-only access error
//       if (error.response?.status === 403) {
//         return rejectWithValue('Admin access required to update cars')
//       }
//       if (error.response?.status === 401) {
//         return rejectWithValue('Please login as admin to update cars')
//       }
//       return rejectWithValue(error.response?.data?.error || 'Failed to update car')
//     }
//   }
// )

// export const deleteCar = createAsyncThunk(
//   'cars/delete',
//   async (id: number, { rejectWithValue }) => {
//     try {
//       await carAPI.delete(id)
//       return id
//     } catch (error: any) {
//       // Handle admin-only access error
//       if (error.response?.status === 403) {
//         return rejectWithValue('Admin access required to delete cars')
//       }
//       if (error.response?.status === 401) {
//         return rejectWithValue('Please login as admin to delete cars')
//       }
//       return rejectWithValue(error.response?.data?.error || 'Failed to delete car')
//     }
//   }
// )

// const carSlice = createSlice({
//   name: 'cars',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCars.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchCars.fulfilled, (state, action) => {
//         state.loading = false
//         state.cars = action.payload
//       })
//       .addCase(fetchCars.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })
//       .addCase(createCar.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(createCar.fulfilled, (state, action) => {
//         state.loading = false
//         state.cars.push(action.payload)
//       })
//       .addCase(createCar.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })
//       .addCase(updateCar.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(updateCar.fulfilled, (state, action) => {
//         state.loading = false
//         const index = state.cars.findIndex(car => car.carID === action.payload.carID)
//         if (index !== -1) {
//           state.cars[index] = action.payload
//         }
//       })
//       .addCase(updateCar.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })
//       .addCase(deleteCar.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(deleteCar.fulfilled, (state, action) => {
//         state.loading = false
//         state.cars = state.cars.filter(car => car.carID !== action.payload)
//       })
//       .addCase(deleteCar.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })
//   },
// })

// export const { clearError } = carSlice.actions
// export default carSlice.reducer