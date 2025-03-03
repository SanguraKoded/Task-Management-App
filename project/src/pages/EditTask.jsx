import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { taskService, adminService } from '../services/api'

function EditTask() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: ''
  })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch task and users in parallel
        const [taskResponse, usersResponse] = await Promise.all([
          taskService.getTaskById(id),
          adminService.getAllUsers()
        ])
        
        const task = taskResponse.data
        setFormData({
          title: task.title,
          description: task.description,
          assignedTo: task.assignedTo ? task.assignedTo.id.toString() : ''
        })
        
        setUsers(usersResponse.data)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load task data')
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [id])

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
      
      await taskService.updateTask(id, taskData)
      toast.success('Task updated successfully')
      navigate(`/tasks/${id}`)
      window.location.reload();

    } catch (err) {
      console.error('Error updating task:', err)
      setError(err.response?.data?.message || 'Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return <div className="loading">Loading task data...</div>
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h1>Edit Task</h1>
        <Link to={`/tasks/${id}`} className="btn btn-secondary">
          <FaArrowLeft /> Back to Task
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
          </div>
          
          <div className="form-footer">
            <Link to={`/tasks/${id}`} className="btn btn-secondary">
              Cancel
            </Link>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTask