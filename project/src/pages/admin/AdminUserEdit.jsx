import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { adminService } from '../../services/api'

function AdminUserEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    userName: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [loadingUser, setLoadingUser] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await adminService.getUserById(id)
        const user = response.data
        setFormData({
          userName: user.userName,
          email: user.email
        })
      } catch (err) {
        console.error('Error fetching user:', err)
        setError('Failed to load user data')
      } finally {
        setLoadingUser(false)
      }
    }

    fetchUser()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate email format
    if (!formData.email.endsWith('@gmail.com') && 
        !formData.email.endsWith('@outlook.com') && 
        !formData.email.endsWith('@yahoo.com')) {
      setError('Email must end with @gmail.com, @outlook.com, or @yahoo.com')
      setLoading(false)
      return
    }

    try {
      await adminService.updateUser(id, formData)
      toast.success('User updated successfully')
      navigate('/admin/users')
      window.location.reload();

    } catch (err) {
      console.error('Error updating user:', err)
      setError(err.response?.data?.message || 'Failed to update user')
    } finally {
      setLoading(false)
    }
  }

  if (loadingUser) {
    return <div className="loading">Loading user data...</div>
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h1>Edit User</h1>
        <Link to="/admin/users" className="btn btn-secondary">
          <FaArrowLeft /> Back to Users
        </Link>
      </div>

      <div className="card">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              id="userName"
              name="userName"
              className="form-control"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <small>Must end with @gmail.com, @outlook.com, or @yahoo.com</small>
          </div>
          
          <div className="form-footer">
            <Link to="/admin/users" className="btn btn-secondary">
              Cancel
            </Link>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminUserEdit