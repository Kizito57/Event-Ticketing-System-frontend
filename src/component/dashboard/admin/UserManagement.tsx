import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search, Users, ShieldCheck, UserCheck, Edit, Trash2 } from 'lucide-react'
import { type AppDispatch, type RootState } from '../../../store/store'
import {
  fetchUsers,
  deleteUser,
  updateUser,
  clearError,
  setSelectedUser,
} from '../../../store/slices/usersSlice'
import { API_BASE_URL } from '../../../services/api'
import { toast } from 'react-toastify'

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
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
    setUserToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUser(userToDelete)).unwrap()
        toast.success('User deleted successfully')
      } catch (error: any) {
        toast.error(error || 'Failed to delete user')
      }
      setIsDeleteModalOpen(false)
      setUserToDelete(null)
    }
  }

  const cancelDelete = () => {
    setIsDeleteModalOpen(false)
    setUserToDelete(null)
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
        <div className="loading loading-spinner loading-lg" data-test="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6" data-test="user-management">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" data-test="user-management-heading">User Management</h2>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
        {[
          { label: 'Total Users', value: userStats.total, icon: Users, color: 'text-blue-600', test: 'stat-total' },
          { label: 'Verified Users', value: userStats.verified, icon: UserCheck, color: 'text-green-600', test: 'stat-verified' },
          { label: 'Admins', value: userStats.admins, icon: ShieldCheck, color: 'text-purple-600', test: 'stat-admins' },
        ].map(({ label, value, icon: Icon, color, test }) => (
          <div key={label} className="bg-base-100 border border-base-300 rounded-xl shadow p-4 flex justify-between items-center" data-test={test}>
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
          data-test="user-search-input"
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered pl-10 w-full"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="table table-zebra w-full bg-base-100 rounded-lg shadow" data-test="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Avatar</th>
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
                <td colSpan={7} className="text-center py-6" data-test="no-users">No users found</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.user_id} data-test={`user-row-${user.user_id}`}>
                  <td>{user.user_id}</td>
                  <td>
                    <img
                      src={
                        user.image_url?.startsWith('http')
                          ? user.image_url
                          : `${API_BASE_URL}${user.image_url}`
                      }
                      alt={`${user.first_name} ${user.last_name}`}
                      className="w-10 h-10 rounded-full object-cover border"
                      data-test={`user-avatar-${user.user_id}`}
                    />
                  </td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="badge badge-outline" data-test={`user-role-${user.user_id}`}>{user.role}</div>
                  </td>
                  <td>
                    <div
                      className={`badge ${user.is_verified ? 'badge-success' : 'badge-warning'}`}
                      data-test={`user-verified-${user.user_id}`}
                    >
                      {user.is_verified ? 'Verified' : 'Pending'}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        data-test={`edit-user-${user.user_id}`}
                        onClick={() => handleEdit(user)}
                        className="btn btn-sm btn-info"
                        disabled={loading}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        data-test={`delete-user-${user.user_id}`}
                        onClick={() => handleDelete(user.user_id)}
                        className="btn btn-sm btn-error"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" data-test="edit-modal">
          <div className="bg-white dark:bg-base-100 rounded-lg shadow-2xl border w-full max-w-md mx-4 p-6">
            <h3 className="font-bold text-lg mb-4">Edit User</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label-text">First Name</label>
                <input
                  data-test="edit-first-name"
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
                  data-test="edit-last-name"
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
                  data-test="edit-email"
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
                  data-test="edit-role"
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
                    data-test="edit-verified-checkbox"
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
                <button
                  data-test="edit-cancel-button"
                  type="button"
                  onClick={closeModal}
                  className="btn btn-ghost w-1/2"
                >
                  Cancel
                </button>
                <button
                  data-test="edit-submit-button"
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" data-test="delete-modal">
          <div className="bg-white dark:bg-base-100 rounded-lg shadow-2xl border p-6">
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-2">
              <button
                id="cancel-btn"
                onClick={cancelDelete}
                className="btn btn-outline"
                data-test="delete-cancel-button"
              >
                No
              </button>
              <button
                id="delete-btn"
                onClick={confirmDelete}
                className="btn btn-primary"
                data-test="delete-confirm-button"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement