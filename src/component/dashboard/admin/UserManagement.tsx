import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { type AppDispatch, type RootState } from '../../../store/store'
import {
  fetchUsers,
  deleteUser,
  updateUser,
  clearError,
  setSelectedUser,
} from '../../../store/slices/usersSlice'

interface UserFormData {
  first_name: string
  last_name: string
  email: string
  role: 'user' | 'admin'
  is_verified: boolean
}

const UserManagement = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading, error, selectedUser } = useSelector((state: RootState) => state.users)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<UserFormData>({
    first_name: '',
    last_name: '',
    email: '',
    role: 'user',
    is_verified: false,
  })

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  useEffect(() => {
    if (!isModalOpen) {
      dispatch(clearError())
    }
  }, [isModalOpen, dispatch])

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await dispatch(deleteUser(id))
      if (deleteUser.fulfilled.match(result)) {
        // success - Redux state already updated
      }
    }
  }

  const handleEdit = (user: any) => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
    })
    dispatch(setSelectedUser(user))
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedUser) {
      const result = await dispatch(updateUser({
        user_id: selectedUser.user_id,
        ...formData,
      }))

      if (updateUser.fulfilled.match(result)) {
        setIsModalOpen(false)
        resetForm()
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const closeModal = () => {
    setIsModalOpen(false)
    dispatch(clearError())
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      role: 'user',
      is_verified: false,
    })
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
          <button
            onClick={() => dispatch(clearError())}
            className="btn btn-sm btn-ghost"
          >
            ×
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.email}</td>
                <td>
                  <div className="badge badge-outline">{user.role}</div>
                </td>
                <td>
                  <div className={`badge ${user.is_verified ? 'badge-success' : 'badge-warning'}`}>
                    {user.is_verified ? 'Verified' : 'Pending'}
                  </div>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="btn btn-sm btn-primary min-h-8 h-8"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.user_id)}
                      className="btn btn-sm btn-error min-h-8 h-8"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl border-2 border-gray-300 w-full max-w-md mx-4 p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-900">
              Edit User
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="block mb-1">
                  <span className="text-sm font-medium text-gray-700">First Name</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="block mb-1">
                  <span className="text-sm font-medium text-gray-700">Last Name</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="block mb-1">
                  <span className="text-sm font-medium text-gray-700">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="block mb-1">
                  <span className="text-sm font-medium text-gray-700">Role</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-control">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_verified"
                    checked={formData.is_verified}
                    onChange={handleInputChange}
                    className="checkbox"
                  />
                  <span className="text-sm font-medium text-gray-700">Verified</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-outline w-1/2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary w-1/2"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement