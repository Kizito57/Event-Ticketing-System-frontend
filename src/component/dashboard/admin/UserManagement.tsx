import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search, Users, ShieldCheck, UserCheck } from 'lucide-react'
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
  const { users, loading, selectedUser } = useSelector((state: RootState) => state.users)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
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
    if (!isModalOpen) dispatch(clearError())
  }, [isModalOpen, dispatch])

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await dispatch(deleteUser(id))
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
      await dispatch(updateUser({
        user_id: selectedUser.user_id,
        ...formData,
      }))
      setIsModalOpen(false)
      resetForm()
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

  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const userStats = {
    total: users.length,
    verified: users.filter(u => u.is_verified).length,
    admins: users.filter(u => u.role === 'admin').length,
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
        {[
          { label: 'Total Users', value: userStats.total, icon: Users, color: 'text-blue-600' },
          { label: 'Verified Users', value: userStats.verified, icon: UserCheck, color: 'text-green-600' },
          { label: 'Admins', value: userStats.admins, icon: ShieldCheck, color: 'text-purple-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-base-100 border border-base-300 rounded-xl shadow p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-base-content/70">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
            <Icon className={`h-8 w-8 ${color}`} />
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-1/2 mt-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 h-5 w-5" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered pl-10 w-full"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="table table-zebra w-full bg-base-100 rounded-lg shadow">
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
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">No users found</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
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
                        className="btn btn-sm btn-info"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.user_id)}
                        className="btn btn-sm btn-error"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-base-100 rounded-lg shadow-2xl border w-full max-w-md mx-4 p-6">
            <h3 className="font-bold text-lg mb-4">Edit User</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label-text">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label-text">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label-text">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label-text">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="select select-bordered"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-control">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_verified"
                    checked={formData.is_verified}
                    onChange={handleInputChange}
                    className="checkbox"
                  />
                  <span>Verified</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn btn-ghost w-1/2">Cancel</button>
                <button type="submit" className="btn btn-primary w-1/2" disabled={loading}>
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
