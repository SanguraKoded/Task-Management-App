import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaTasks, FaSignOutAlt, FaUserShield } from 'react-icons/fa'

function Navbar({ user, setUser }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  const isAdmin = user?.role === 'ADMIN'
  const isUser = user?.role === 'USER'

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">TaskManager</Link>

        <div className="navbar-links">
          {user ? (
            <>
              {isUser && (
                <Link to="/tasks" className="navbar-link">
                  <FaTasks /> Tasks
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin-tasks" className="navbar-link">
                  <FaTasks /> All Tasks
                </Link>
              )}

              <Link to="/profile" className="navbar-link">
                <FaUser /> Profile
              </Link>

              {isAdmin && (
                <Link to="/admin" className="navbar-link">
                  <FaUserShield /> Admin
                </Link>
              )}

              <button onClick={handleLogout} className="navbar-link btn-link">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
