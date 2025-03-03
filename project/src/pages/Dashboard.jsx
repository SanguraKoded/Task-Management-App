import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaClipboardList } from 'react-icons/fa'
import { taskService, userService } from '../services/api'

function Dashboard({ user }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const isAdmin = user && user.role === 'ADMIN'

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await userService.getUserTasks(user.sub)
        setTasks(response.data)
      } catch (err) {
        console.error('Error fetching tasks:', err)
        setError('Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [user])

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div>
      <div className="dashboard-header flex-between">
        <h1>Dashboard</h1>
        {isAdmin && (
          <Link to="/tasks/create" className="btn btn-primary">
            <FaPlus /> Create New Task
          </Link>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <div className="number">{tasks.length}</div>
        </div>
        <div className="stat-card">
          <h3>Completed Tasks</h3>
          <div className="number">0</div>
        </div>
        <div className="stat-card">
          <h3>Pending Tasks</h3>
          <div className="number">{tasks.length}</div>
        </div>
      </div>

      <h2 className="mb-2">Recent Tasks</h2>
      
      {tasks.length === 0 ? (
        <div className="card text-center">
          <FaClipboardList size={48} style={{ margin: '0 auto 16px' }} />
          <h3>No tasks yet</h3>
          {isAdmin ? (
            <>
              <p>Create your first task to get started</p>
              <Link to="/tasks/create" className="btn btn-primary mt-2">
                Create Task
              </Link>
            </>
          ) : (
            <p>You don't have any assigned tasks yet</p>
          )}
        </div>
      ) : (
        <div className="task-list">
          {tasks.slice(0, 3).map((task) => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description.substring(0, 100)}...</p>
              <div className="task-card-footer">
                <Link to={`/tasks/${task.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {tasks.length > 3 && (
        <div className="text-center mt-3">
          <Link to="/tasks" className="btn btn-secondary">
            View All Tasks
          </Link>
        </div>
      )}
    </div>
  )
}

export default Dashboard