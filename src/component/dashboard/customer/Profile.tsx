import { useState } from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from '../../../store/store'
import { usersAPI } from '../../../services/api'
// import './Profile.css'

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
  first_name: user?.first_name || '',
  last_name: user?.last_name || '',
  email: user?.email || '',
})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [hasUpdated, setHasUpdated] = useState(false) // Track if data has been updated

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await usersAPI.update(user!.user_id, formData)
      setMessage('Profile updated successfully!')
      setIsEditing(false)
      setHasUpdated(true) // Mark that we've updated the data
    } catch (error) {
      setMessage('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  // Use updated formData if available, otherwise fall back to user data(display datakeys)
 const displayData = hasUpdated ? formData : {
  first_name: user?.first_name || '',
  last_name: user?.last_name || '',
  email: user?.email || ''
}

  return (
    <div className="profile">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'} mb-4`}>
          <span>{message}</span>
        </div>
      )}

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">First Name</span>
                </label>
                <p className="text-lg">{displayData.first_name}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Last Name</span>
                </label>
                {/* form binding */}
                <p className="text-lg">{displayData.last_name}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <p className="text-lg">{displayData.email}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Role</span>
                </label>
                <span className="badge badge-primary">{user?.role}</span>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Verification Status</span>
                </label>
                <span className={`badge ${user?.is_verified ? 'badge-success' : 'badge-warning'}`}>
                  {user?.is_verified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="card-actions justify-end">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="card-actions justify-end">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`btn btn-primary ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
