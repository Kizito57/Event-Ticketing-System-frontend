// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { type AppDispatch, type RootState } from '../../../store/store'
// import { fetchCars } from '../../../store/slices/carSlice'
// import { createBooking } from '../../../store/slices/bookingSlice'

// const CarBrowsing = () => {
//   const dispatch = useDispatch<AppDispatch>()
//   const { cars, loading, error } = useSelector((state: RootState) => state.cars)
//   const { user } = useSelector((state: RootState) => state.auth)

//   const [selectedCar, setSelectedCar] = useState<any>(null)
//   const [bookingData, setBookingData] = useState({
//     bookingDate: '',
//     returnDate: ''
//   })

//   useEffect(() => {
//     dispatch(fetchCars())
//   }, [dispatch])

//   const handleBookCar = (car: any) => {
//     setSelectedCar(car)
//   }

//   const handleBookingSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!user?.customerID) {
//       alert('Please log in to book a car.')
//       return
//     }

//     const bookingDate = new Date(bookingData.bookingDate)
//     const returnDate = new Date(bookingData.returnDate)

//     if (isNaN(bookingDate.getTime()) || isNaN(returnDate.getTime())) {
//       alert('Please enter valid booking and return dates.')
//       return
//     }

//     if (returnDate <= bookingDate) {
//       alert('Return date must be after booking date.')
//       return
//     }

//     const days = Math.ceil((returnDate.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24))
//     const totalAmount = days * selectedCar.rentalRate

//     dispatch(createBooking({
//       customerID: user.customerID,
//       carID: selectedCar.carID,
//       rentalStartDate: bookingData.bookingDate,
//       rentalEndDate: bookingData.returnDate,
//       totalAmount,
//       bookingStatus: 'pending'
//     }))

//     setSelectedCar(null)
//     setBookingData({ bookingDate: '', returnDate: '' })
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     )
//   }

//   return (
//     <div className="car-browsing">
//       <h2 className="text-2xl font-bold mb-6">Available Cars</h2>

//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {cars.filter(car => car.availability).map(car => (
//           <div key={car.carID} className="card bg-base-100 shadow-lg">
//             {car.imageUrl && (
//               <figure>
//                 <img
//                   src={car.imageUrl.startsWith('http') ? car.imageUrl : `http://localhost:3000${car.imageUrl}`}
//                   alt={car.carModel}
//                   className="w-full h-48 object-cover"
//                 />
//               </figure>
//             )}
//             <div className="card-body">
//               <h3 className="card-title">{car.carModel}</h3>
//               <div className="space-y-1">
//                 <p><strong>Year:</strong> {new Date(car.year).toISOString().slice(0, 10)}</p>
//                 <p><strong>Color:</strong> {car.color}</p>
//                 <p><strong>Rate:</strong> ${car.rentalRate}/day</p>
//               </div>
//               <div className="card-actions justify-end">
//                 <button
//                   onClick={() => handleBookCar(car)}
//                   className="btn btn-primary"
//                 >
//                   Book Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

// {selectedCar && (
//   <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg z-50">
//     <h3 className="font-bold text-lg mb-4">Book {selectedCar.carModel}</h3>
//     <form onSubmit={handleBookingSubmit}>
//       <div className="form-control mb-4">
//         <label htmlFor="booking-date" className="label">
//           <span className="label-text">Booking Date</span>
//         </label>
//         <input
//           id="booking-date"
//           type="date"
//           value={bookingData.bookingDate}
//           onChange={(e) => setBookingData({ ...bookingData, bookingDate: e.target.value })}
//           className="input input-bordered w-full"
//           required
//         />
//       </div>
//       <div className="form-control mb-4">
//         <label htmlFor="return-date" className="label">
//           <span className="label-text">Return Date</span>
//         </label>
//         <input
//           id="return-date"
//           type="date"
//           value={bookingData.returnDate}
//           onChange={(e) => setBookingData({ ...bookingData, returnDate: e.target.value })}
//           className="input input-bordered w-full"
//           required
//         />
//       </div>
//       <div className="flex justify-end space-x-2">
//         <button
//           type="button"
//           onClick={() => setSelectedCar(null)}
//           className="btn btn-ghost"
//         >
//           Cancel
//         </button>
//         <button type="submit" className="btn btn-primary">
//           Confirm Booking
//         </button>
//       </div>
//     </form>
//   </div>
// )}

//     </div>
//   )
// }

// export default CarBrowsing
