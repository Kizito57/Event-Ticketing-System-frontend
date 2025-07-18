// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { type AppDispatch, type RootState } from '../../../store/store'
// import { fetchCars, createCar, updateCar, deleteCar } from '../../../store/slices/carSlice'

// const CarManagement = () => {
//   const dispatch = useDispatch<AppDispatch>()
//   const { cars, loading, error } = useSelector((state: RootState) => state.cars)
//   const [showAddForm, setShowAddForm] = useState(false)
//   const [showEditForm, setShowEditForm] = useState(false)
//   const [editingCar, setEditingCar] = useState<any>(null)
//   const [imageFile, setImageFile] = useState<File | null>(null)
//   const [imagePreview, setImagePreview] = useState<string>('')
//   const [formData, setFormData] = useState({
//     carModel: '',
//     year: '',
//     color: '',
//     rentalRate: '',
//     availability: true,
//     locationID: 1, // Default location
//   })

//   useEffect(() => {
//     dispatch(fetchCars())
//   }, [dispatch])

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       setImageFile(file)
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     try {
//       let imageUrl = ''

//       // Upload image if selected
//       if (imageFile) {
//         const uploadFormData = new FormData()
//         uploadFormData.append('file', imageFile)

//         const uploadResponse = await fetch('http://localhost:3000/api/upload', {
//           method: 'POST',
//           body: uploadFormData
//         })

//         if (!uploadResponse.ok) throw new Error('Image upload failed')

//         const uploadResult = await uploadResponse.json()
//         imageUrl = uploadResult.imageUrl
//       }

//       const carData = {
//         ...formData,
//         year: formData.year,
//         rentalRate: parseFloat(formData.rentalRate),
//         imageUrl
//       }

//       if (editingCar) {
//         await dispatch(updateCar({ id: editingCar.carID, carData }))
//         setShowEditForm(false)
//         setEditingCar(null)
//       } else {
//         await dispatch(createCar(carData))
//         setShowAddForm(false)
//       }

//       resetForm()
//     } catch (error) {
//       console.error('Error saving car:', error)
//     }
//   }

//   const handleEdit = (car: any) => {
//     setEditingCar(car)
//     setFormData({
//       carModel: car.carModel,
//       year: car.year?.slice(0, 10) || '',
//       color: car.color,
//       rentalRate: car.rentalRate.toString(),
//       availability: car.availability,
//       locationID: car.locationID || 1,
//     })
//     setImagePreview(car.imageUrl || '')
//     setShowEditForm(true)
//   }

//   const handleDelete = (id: number) => {
//     if (window.confirm('Are you sure you want to delete this car?')) {
//       dispatch(deleteCar(id))
//     }
//   }

//   const resetForm = () => {
//     setFormData({
//       carModel: '',
//       year: '',
//       color: '',
//       rentalRate: '',
//       availability: true,
//       locationID: 1,
//     })
//     setImagePreview('')
//     setImageFile(null)
//     setShowAddForm(false)
//     setShowEditForm(false)
//     setEditingCar(null)
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     )
//   }

//   return (
//     <div className="w-full">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Car Management</h2>
//         <button 
//           onClick={() => setShowAddForm(true)}
//           className="btn btn-primary"
//         >
//           Add New Car
//         </button>
//       </div>

//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//         </div>
//       )}

//       {(showAddForm || showEditForm) && (
//         <div className="card bg-base-100 shadow-lg mb-6 border border-base-300">
//           <div className="card-body">
//             <h3 className="card-title">
//               {editingCar ? 'Edit Car' : 'Add New Car'}
//             </h3>
//             <form onSubmit={handleSubmit}>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Left Column - Form Fields */}
//                 <div className="space-y-4">
//                   <div className="form-control">
//                     <label className="label">
//                       <span className="label-text">Car Model</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.carModel}
//                       onChange={(e) => setFormData({...formData, carModel: e.target.value})}
//                       className="input input-bordered"
//                       required
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="form-control">
//                       <label className="label">
//                         <span className="label-text">Year</span>
//                       </label>
//                       <input
//                         type="date"
//                         value={formData.year}
//                         onChange={(e) => setFormData({...formData, year: e.target.value})}
//                         className="input input-bordered"
//                         required
//                       />
//                     </div>
//                     <div className="form-control">
//                       <label className="label">
//                         <span className="label-text">Color</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.color}
//                         onChange={(e) => setFormData({...formData, color: e.target.value})}
//                         className="input input-bordered"
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="form-control">
//                     <label className="label">
//                       <span className="label-text">Rental Rate (per day)</span>
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={formData.rentalRate}
//                       onChange={(e) => setFormData({...formData, rentalRate: e.target.value})}
//                       className="input input-bordered"
//                       required
//                     />
//                   </div>
//                   <div className="form-control">
//                     <label className="label cursor-pointer">
//                       <span className="label-text">Available for Rent</span>
//                       <input
//                         type="checkbox"
//                         checked={formData.availability}
//                         onChange={(e) => setFormData({...formData, availability: e.target.checked})}
//                         className="checkbox"
//                       />
//                     </label>
//                   </div>
//                 </div>

//                 {/* Right Column - Image Upload */}
//                 <div className="space-y-4">
//                   <div className="form-control">
//                     <label className="label">
//                       <span className="label-text">Car Image</span>
//                     </label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="file-input file-input-bordered w-full"
//                     />
//                   </div>
//                   {imagePreview && (
//                     <div className="w-full">
//                       <label className="label">
//                         <span className="label-text">Preview</span>
//                       </label>
//                       <div className="w-full h-48 border-2 border-dashed border-base-300 rounded-lg overflow-hidden">
//                         <img
//                           src={imagePreview.startsWith('data:') ? imagePreview : `http://localhost:3000${imagePreview}`}
//                           alt="Car preview"
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                     </div>
//                   )}
//                   {!imagePreview && (
//                     <div className="w-full h-48 border-2 border-dashed border-base-300 rounded-lg flex items-center justify-center text-base-content/50">
//                       <div className="text-center">
//                         <svg className="mx-auto h-12 w-12 text-base-content/30" stroke="currentColor" fill="none" viewBox="0 0 48 48">
//                           <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                         </svg>
//                         <p className="mt-2 text-sm">Upload car image</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="card-actions justify-end mt-6">
//                 <button 
//                   type="button"
//                   onClick={resetForm}
//                   className="btn btn-ghost"
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary">
//                   {editingCar ? 'Update Car' : 'Add Car'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="overflow-x-auto">
//         <table className="table table-zebra w-full bg-base-100 shadow-lg rounded-lg">
//           <thead>
//             <tr>
//               <th className="bg-base-200 font-semibold">Image</th>
//               <th className="bg-base-200 font-semibold">ID</th>
//               <th className="bg-base-200 font-semibold">Model</th>
//               <th className="bg-base-200 font-semibold">Year</th>
//               <th className="bg-base-200 font-semibold">Color</th>
//               <th className="bg-base-200 font-semibold">Rental Rate</th>
//               <th className="bg-base-200 font-semibold">Available</th>
//               <th className="bg-base-200 font-semibold">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {cars.map((car) => (
//               <tr key={car.carID}>
//                 <td>
//                   <div className="avatar">
//                     <div className="w-16 h-12 rounded">
//                       {car.imageUrl ? (
//                         <img 
//                           src={car.imageUrl.startsWith('http') ? car.imageUrl : `http://localhost:3000${car.imageUrl}`}
//                           alt={car.carModel}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full bg-base-300 flex items-center justify-center">
//                           <svg className="w-6 h-6 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                           </svg>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </td>
//                 <td>{car.carID}</td>
//                 <td className="font-medium">{car.carModel}</td>
//               <td>{new Date(car.year).toISOString().slice(0, 10)}</td>

//                 <td>{car.color}</td>
//                 <td className="font-semibold">${car.rentalRate}/day</td>
//                 <td>
//                   <span className={`badge ${car.availability ? 'badge-success' : 'badge-error'}`}>
//                     {car.availability ? 'Available' : 'Unavailable'}
//                   </span>
//                 </td>
//                 <td>
//                   <div className="flex gap-2">
//                     <button 
//                       onClick={() => handleEdit(car)}
//                       className="btn btn-sm btn-info min-h-8 h-8"
//                     >
//                       Edit
//                     </button>
//                     <button 
//                       onClick={() => handleDelete(car.carID)}
//                       className="btn btn-sm btn-error min-h-8 h-8"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default CarManagement