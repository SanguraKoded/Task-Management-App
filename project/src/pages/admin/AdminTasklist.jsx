import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { taskService, userService } from '../../services/api'

function AdminTaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    let isMounted = true;
    const fetchTasks = async () => {
      try {
        const response = await taskService.getAllTasks();
        if (isMounted) setTasks(response.data);
      } catch (err) {
        if (isMounted) setError('Failed to load tasks');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (user) fetchTasks();
    return () => { isMounted = false; };
  }, [user?.sub]);

  const handleDelete = async (id) => {
    if (!isAdmin) return toast.error('Only administrators can delete tasks');
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      toast.success('Task deleted successfully');
      window.location.reload();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (loading) {
    return <div className="loading">Loading tasks...</div>
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h1>All Tasks</h1>
        {isAdmin && (
          <Link to="/tasks/create" className="btn btn-primary">
            <FaPlus /> Create New Task
          </Link>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-3">
        <div className="form-group mb-0">
          <div className="flex" style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch style={{ position: 'absolute', right: '10px', top: '12px', color: '#666' }} />
          </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="card text-center">
          <h3>No tasks found</h3>
          {searchTerm ? (
            <p>No tasks match your search criteria</p>
          ) : (
            <>
              {isAdmin ? (
                <>
                  <p>You don't have any tasks yet</p>
                  <Link to="/tasks/create" className="btn btn-primary mt-2">
                    Create Your First Task
                  </Link>
                </>
              ) : (
                <p>You don't have any assigned tasks yet</p>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description.substring(0, 100)}...</p>
              <div className="task-card-footer">
                <Link to={`/tasks/${task.id}`} className="btn btn-secondary">
                  View Details
                </Link>
                {isAdmin && (
                  <div className="task-card-actions">
                    <Link to={`/tasks/edit/${task.id}`} className="btn btn-primary">
                      <FaEdit />
                    </Link>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDelete(task.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminTaskList