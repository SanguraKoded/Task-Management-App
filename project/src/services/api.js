import axios from 'axios'

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8080', // Update with your backend URL
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth services
export const authService = {
  login: (credentials) => api.post('/api/v1/users/login', credentials),
  register: (userData) => api.post('/api/v1/users/add', userData),
  getProfile: () => api.get('/api/v1/users/profile')
}

// User services
export const userService = {
  updateUser: (id, userData) => api.put(`/api/v1/users/update/${id}`, userData),
  getUserTasks: (username) => api.get(`/api/v1/users/tasks/username/${username}`),
  deleteUser: (id) => api.delete(`/api/v1/users/delete/${id}`)
}

// Task services
export const taskService = {
  getAllTasks: () => api.get('/tasks'),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (taskData) => api.post('/tasks/add', taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/delete/${id}`),
  getTaskByTitle: (title) => api.get(`/tasks/title/${title}`),
  getTasksByUserId: (id) => api.get(`/tasks/user/${id}`)
}

// Admin services
export const adminService = {
  getAllUsers: () => api.get('/api/v2/admin/all'),
  getUserById: (id) => api.get(`/api/v2/admin/user/${id}`),
  createUser: (userData) => api.post('/api/v2/add-admin', userData),
  updateUser: (id, userData) => api.put(`/api/v2/admin/update/${id}`, userData),
  deleteUser: (id) => api.delete(`/api/v2/admin/delete/${id}`),
  getUsersByRole: (role) => api.get(`/api/v2/admin/role/${role}`),
  getUserTasks: (id) => api.get(`/api/v2/admin/tasks/${id}`),
  changeUserRole: (id) => api.put(`/api/v2/admin/roles/change/${id}`)
}

export default api