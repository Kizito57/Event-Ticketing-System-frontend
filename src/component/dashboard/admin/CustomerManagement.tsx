// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { type AppDispatch, type RootState } from '../../../store/store'
// import {
//   fetchCustomers,
//   deleteCustomer,
//   updateCustomer,
//   clearError,
//   setSelectedCustomer,
// } from '../../../store/slices/usersSlice'

// interface CustomerFormData {
//   firstName: string
//   lastName: string
//   email: string
//   role: string
//   isVerified: boolean
// }

// const CustomerManagement = () => {
//   const dispatch = useDispatch<AppDispatch>()
//   const { customers, loading, error, selectedCustomer } = useSelector((state: RootState) => state.customers)

//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [formData, setFormData] = useState<CustomerFormData>({
//     firstName: '',
//     lastName: '',
//     email: '',
//     role: '',
//     isVerified: false,
//   })

//   useEffect(() => {
//     dispatch(fetchCustomers())
//   }, [dispatch])

//   useEffect(() => {
//     if (!isModalOpen) {
//       dispatch(clearError())
//     }
//   }, [isModalOpen, dispatch])

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Are you sure you want to delete this customer?')) {
//       const result = await dispatch(deleteCustomer(id))
//       if (deleteCustomer.fulfilled.match(result)) {
//         // success - Redux state already updated
//       }
//     }
//   }

//   const handleEdit = (customer: any) => {
//     setFormData({
//       firstName: customer.firstName,
//       lastName: customer.lastName,
//       email: customer.email,
//       role: customer.role,
//       isVerified: customer.isVerified,
//     })
//     dispatch(setSelectedCustomer(customer))
//     setIsModalOpen(true)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (selectedCustomer) {
//       const result = await dispatch(updateCustomer({
//         customerID: selectedCustomer.customerID,
//         ...formData,
//       }))

//       if (updateCustomer.fulfilled.match(result)) {
//         setIsModalOpen(false)
//         resetForm()
//       }
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
//     }))
//   }

//   const closeModal = () => {
//     setIsModalOpen(false)
//     dispatch(clearError())
//     resetForm()
//   }

//   const resetForm = () => {
//     setFormData({
//       firstName: '',
//       lastName: '',
//       email: '',
//       role: '',
//       isVerified: false,
//     })
//   }

//   if (loading && customers.length === 0) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="loading loading-spinner loading-lg"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Customer Management</h1>
//       </div>

//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//           <button
//             onClick={() => dispatch(clearError())}
//             className="btn btn-sm btn-ghost"
//           >
//             ×
//           </button>
//         </div>
//       )}

//       <div className="overflow-x-auto">
//         <table className="table table-zebra w-full">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Verified</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((customer) => (
//               <tr key={customer.customerID}>
//                 <td>{customer.customerID}</td>
//                 <td>{customer.firstName} {customer.lastName}</td>
//                 <td>{customer.email}</td>
//                 <td>
//                   <div className="badge badge-outline">{customer.role}</div>
//                 </td>
//                 <td>
//                   <div className={`badge ${customer.isVerified ? 'badge-success' : 'badge-warning'}`}>
//                     {customer.isVerified ? 'Verified' : 'Pending'}
//                   </div>
//                 </td>
//                 <td>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleEdit(customer)}
//                       className="btn btn-sm btn-primary min-h-8 h-8"
//                       disabled={loading}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(customer.customerID)}
//                       className="btn btn-sm btn-error min-h-8 h-8"
//                       disabled={loading}
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

//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-2xl border-2 border-gray-300 w-full max-w-md mx-4 p-6">
//             <h3 className="font-bold text-lg mb-4 text-gray-900">
//               Edit Customer
//             </h3>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="form-control">
//                 <label className="block mb-1">
//                   <span className="text-sm font-medium text-gray-700">First Name</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   className="input input-bordered w-full"
//                   required
//                 />
//               </div>

//               <div className="form-control">
//                 <label className="block mb-1">
//                   <span className="text-sm font-medium text-gray-700">Last Name</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   className="input input-bordered w-full"
//                   required
//                 />
//               </div>

//               <div className="form-control">
//                 <label className="block mb-1">
//                   <span className="text-sm font-medium text-gray-700">Email</span>
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="input input-bordered w-full"
//                   required
//                 />
//               </div>

//               <div className="form-control">
//                 <label className="block mb-1">
//                   <span className="text-sm font-medium text-gray-700">Role</span>
//                 </label>
//                 <select
//                   name="role"
//                   value={formData.role}
//                   onChange={handleInputChange}
//                   className="select select-bordered w-full"
//                   required
//                 >
//                   <option value="">Select Role</option>
//                   <option value="customer">Customer</option>
//                   <option value="admin">Admin</option>
//                   <option value="manager">Manager</option>
//                 </select>
//               </div>

//               <div className="form-control">
//                 <label className="flex items-center gap-3 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="isVerified"
//                     checked={formData.isVerified}
//                     onChange={handleInputChange}
//                     className="checkbox"
//                   />
//                   <span className="text-sm font-medium text-gray-700">Verified</span>
//                 </label>
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="btn btn-outline w-1/2"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary w-1/2"
//                   disabled={loading}
//                 >
//                   {loading ? 'Updating...' : 'Update'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default CustomerManagement
