import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrash, FaTasks, FaUserPlus, FaSearch, FaUserShield } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { adminService } from '../../services/api'

function AdminUserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers()
      setUsers(response.data)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminService.deleteUser(id)
        setUsers(users.filter(user => user.id !== id))
        toast.success('User deleted successfully')
      } catch (err) {
        console.error('Error deleting user:', err)
        toast.error('Failed to delete user')
      }
    }
  }

  const handleRoleChange = async (id) => {
    try {
      const response = await adminService.changeUserRole(id)
      // Update the user in the list
      setUsers(users.map(user => 
        user.id === id ? response.data : user
      ))
      toast.success('User role updated successfully')
    } catch (err) {
      console.error('Error changing role:', err)
      toast.error('Failed to update user role')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (roleFilter) {
      return matchesSearch && user.role === roleFilter
    }
    
    return matchesSearch
  })

  if (loading) {
    return <div className="loading">Loading users...</div>
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h1>Manage Users</h1>
        <Link to="/admin/users/create" className="btn btn-primary">
          <FaUserPlus /> Add New User
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-3">
        <div className="flex-between">
          <div className="form-group mb-0" style={{ flex: 1, marginRight: '16px' }}>
            <div className="flex" style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch style={{ position: 'absolute', right: '10px', top: '12px', color: '#666' }} />
            </div>
          </div>
          <div className="form-group mb-0" style={{ width: '200px' }}>
            <select
              className="form-control"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="card text-center">
          <h3>No users found</h3>
          {searchTerm || roleFilter ? (
            <p>No users match your search criteria</p>
          ) : (
            <p>There are no users in the system</p>
          )}
        </div>
      ) : (
        <div className="card">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <div className="user-actions">
                      <Link to={`/admin/users/${user.id}`} className="btn btn-primary" title="Edit User">
                        <FaEdit />
                      </Link>
                      <button 
                        className="btn btn-secondary" 
                        title="Change Role"
                        onClick={() => handleRoleChange(user.id)}
                      >
                        <FaUserShield />
                      </button>
                      <Link to={`/admin/tasks/${user.id}`} className="btn btn-secondary" title="View Tasks">
                        <FaTasks />
                      </Link>
                      <button 
                        className="btn btn-danger" 
                        title="Delete User"
                        onClick={() => handleDelete(user.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminUserList