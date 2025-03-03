import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { taskService, adminService } from '../services/api'

function CreateTask() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: ''
  })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminService.getAllUsers()
        setUsers(response.data)
      } catch (err) {
        console.error('Error fetching users:', err)
        toast.error('Failed to load users')
      } finally {
        setLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.title.trim()) {
      setError('Title is required')
      setLoading(false)
      return
    }

    if (!formData.description.trim()) {
      setError('Description is required')
      setLoading(false)
      return
    }

    if (!formData.assignedTo) {
      setError('Please assign this task to a user')
      setLoading(false)
      return
    }

    try {
      const taskData = {
        ...formData,
        assignedTo: parseInt(formData.assignedTo)
      }
      
      await taskService.createTask(taskData)
      toast.success('Task created successfully')
      navigate('/tasks')
      window.location.reload();

    } catch (err) {
      console.error('Error creating task:', err)
      setError(err.response?.data?.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h1>Create New Task</h1>
        <Link to="/tasks" className="btn btn-secondary">
          <FaArrowLeft /> Back to Tasks
        </Link>
      </div>

      <div className="card">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="assignedTo">Assign To</label>
            {loadingUsers ? (
              <p>Loading users...</p>
            ) : (
              <select
                id="assignedTo"
                name="assignedTo"
                className="form-control"
                value={formData.assignedTo}
                onChange={handleChange}
                required
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.userName} ({user.email})
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div className="form-footer">
            <Link to="/tasks" className="btn btn-secondary">
              Cancel
            </Link>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || loadingUsers}
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTask