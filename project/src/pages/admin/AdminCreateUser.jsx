import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { adminService } from '../../services/api'

function AdminCreateUser() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate email format
    if (!formData.email.endsWith('@gmail.com') && 
        !formData.email.endsWith('@outlook.com') && 
        !formData.email.endsWith('@yahoo.com')) {
      setError('Email must end with @gmail.com, @outlook.com, or @yahoo.com')
      setLoading(false)
      return
    }

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData
      await adminService.createUser(userData)
      toast.success('User created successfully')
      navigate('/admin/users')
      window.location.reload();

    } catch (err) {
      console.error('Error creating user:', err)
      setError(err.response?.data?.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h1>Create New User</h1>
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
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
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
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminCreateUser