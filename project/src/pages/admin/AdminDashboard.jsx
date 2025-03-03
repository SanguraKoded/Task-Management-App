import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaUsers, FaTasks, FaUserPlus } from 'react-icons/fa'
import { adminService, taskService } from '../../services/api'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    totalTasks: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users and tasks in parallel
        const [usersResponse, tasksResponse, adminUsersResponse] = await Promise.all([
          adminService.getAllUsers(),
          taskService.getAllTasks(),
          adminService.getUsersByRole('ADMIN')
        ])
        
        setStats({
          totalUsers: usersResponse.data.length,
          adminUsers: adminUsersResponse.data.length,
          regularUsers: usersResponse.data.length - adminUsersResponse.data.length,
          totalTasks: tasksResponse.data.length
        })
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError('Failed to load dashboard statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>
  }

  return (
    <div>
      <div className="admin-header flex-between">
        <h1>Admin Dashboard</h1>
        <Link to="/admin/users/create" className="btn btn-primary">
          <FaUserPlus /> Add New User
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="number">{stats.totalUsers}</div>
        </div>
        <div className="stat-card">
          <h3>Admin Users</h3>
          <div className="number">{stats.adminUsers}</div>
        </div>
        <div className="stat-card">
          <h3>Regular Users</h3>
          <div className="number">{stats.regularUsers}</div>
        </div>
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <div className="number">{stats.totalTasks}</div>
        </div>
      </div>

      <div className="admin-actions grid">
        <Link to="/admin/users" className="card text-center">
          <FaUsers size={48} style={{ margin: '0 auto 16px' }} />
          <h3>Manage Users</h3>
          <p>View, edit, and delete user accounts</p>
        </Link>
        <Link to="/admin-tasks" className="card text-center">
          <FaTasks size={48} style={{ margin: '0 auto 16px' }} />
          <h3>Manage Tasks</h3>
          <p>View and manage all tasks in the system</p>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard