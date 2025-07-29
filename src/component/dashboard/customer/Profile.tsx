import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { User, Camera } from 'lucide-react'
import { type RootState } from '../../../store/store'
import { usersAPI, API_BASE_URL } from '../../../services/api'
import { setUser } from '../../../store/slices/authSlice'

const Profile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)

  const [isEditing, setIsEditing] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    image_url: user?.image_url || ''
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      let imageUrl = formData.image_url

      if (imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)

        const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: uploadFormData,
        })

        if (!uploadResponse.ok) throw new Error('Image upload failed')

        const uploadResult = await uploadResponse.json()
        if (!uploadResult.imageUrl) throw new Error('No imageUrl returned from server')
        imageUrl = uploadResult.imageUrl
      }

      const updateData = { ...formData, image_url: imageUrl }

      await usersAPI.update(user!.user_id, updateData)

      const updatedUser = { ...user!, ...updateData }

      dispatch(setUser(updatedUser))
      localStorage.setItem('user', JSON.stringify(updatedUser)) // ✅ Local persistence

      setFormData(updateData)
      setMessage('Profile updated successfully!')
      setIsEditing(false)
      setImageFile(null)
      setImagePreview('')
    } catch (error: any) {
      console.error(error)
      setMessage(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setIsEditing(false)
    setImageFile(null)
    setImagePreview('')
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      image_url: user?.image_url || ''
    })
  }
const getImageSrc = () => {
  const { image_url, first_name, last_name } = formData
  if (image_url?.startsWith('http')) return image_url // Absolute URL
  if (image_url) return `${API_BASE_URL}${image_url}` // Local path from DB like /uploads/...

  // Fallback: initials avatar
  const initials = `${first_name} ${last_name}`.trim() || 'User'
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initials)}`
}



  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">My Profile</h2>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          <span>{message}</span>
        </div>
      )}

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          {!isEditing ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-base-300">
                  <img
                    src={getImageSrc()}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label font-semibold">First Name</label>
                    <p className="text-lg">{formData.first_name}</p>
                  </div>
                  <div>
                    <label className="label font-semibold">Last Name</label>
                    <p className="text-lg">{formData.last_name}</p>
                  </div>
                </div>

                <div>
                  <label className="label font-semibold">Email</label>
                  <p className="text-lg">{formData.email}</p>
                </div>

                <div className="flex gap-4">
                  <div>
                    <label className="label font-semibold">Role</label>
                    <span className="badge badge-primary">{user?.role}</span>
                  </div>
                  <div>
                    <label className="label font-semibold">Status</label>
                    <span className={`badge ${user?.is_verified ? 'badge-success' : 'badge-warning'}`}>
                      {user?.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <button onClick={() => setIsEditing(true)} className="btn btn-primary w-full">
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-base-300 relative group cursor-pointer">
                    <img
                      src={getImageSrc()}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                <p className="text-sm text-base-content/70">Click to change profile picture</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">First Name</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="input input-bordered"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={resetForm} className="btn btn-ghost flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary flex-1">
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
