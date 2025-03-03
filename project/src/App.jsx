import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import TaskList from './pages/TaskList'
import TaskDetails from './pages/TaskDetails'
import CreateTask from './pages/CreateTask'
import EditTask from './pages/EditTask'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUserList from './pages/admin/AdminUserList'
import AdminUserEdit from './pages/admin/AdminUserEdit'
import AdminCreateUser from './pages/admin/AdminCreateUser'
import AdminTasklist from './pages/admin/AdminTasklist'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser(decoded)
      } catch (error) {
        console.error('Invalid token', error)
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const isAdmin = user && user.role === 'ADMIN'

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <main className="container">
        <Routes>
          <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          
          {/* Protected routes */}
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
          <Route path="/tasks" element={user ? <TaskList user={user} /> : <Navigate to="/login" />} />
          <Route path="/tasks/:id" element={user ? <TaskDetails user={user} /> : <Navigate to="/login" />} />
          
          {/* Admin-only routes */}
          <Route path="/admin-tasks" element={user ? <AdminTasklist user={user} /> : <Navigate to="/login" />} />
          <Route path="/tasks/create" element={isAdmin ? <CreateTask user={user} /> : <Navigate to="/" />} />
          <Route path="/tasks/edit/:id" element={isAdmin ? <EditTask user={user} /> : <Navigate to="/" />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/admin/users" element={isAdmin ? <AdminUserList /> : <Navigate to="/" />} />
          <Route path="/admin/users/:id" element={isAdmin ? <AdminUserEdit /> : <Navigate to="/" />} />
          <Route path="/admin/users/create" element={isAdmin ? <AdminCreateUser /> : <Navigate to="/" />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

export default App