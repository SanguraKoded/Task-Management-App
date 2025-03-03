import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { taskService } from '../services/api'

function TaskDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    let isMounted = true;
    const fetchTask = async () => {
      try {
        const response = await taskService.getTaskById(id);
        if (isMounted) setTask(response.data);
      } catch {
        if (isMounted) setError('Failed to load task details');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTask();
    return () => { isMounted = false; };
  }, [id]);

  const handleDelete = async () => {
    if (!isAdmin) return toast.error('Only administrators can delete tasks');
    if (!window.confirm('Are you sure?')) return;
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted successfully');
      navigate('/tasks');
    } catch {
      toast.error('Failed to delete task');
    }
  };


  if (loading) {
    return <div className="loading">Loading task details...</div>
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-danger">{error}</div>
        <Link to="/tasks" className="btn btn-primary">
          <FaArrowLeft /> Back to Tasks
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <Link to="/tasks" className="btn btn-secondary">
          <FaArrowLeft /> Back to Tasks
        </Link>
        {isAdmin && (
          <div>
            <Link to={`/tasks/edit/${task.id}`} className="btn btn-primary" style={{ marginRight: '8px' }}>
              <FaEdit /> Edit
            </Link>
            <button className="btn btn-danger" onClick={handleDelete}>
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="card">
        <h1 className="mb-3">{task.title}</h1>
        
        <div className="mb-3">
          <h3 className="mb-1">Description</h3>
          <p>{task.description}</p>
        </div>
        
        <div className="mb-3">
          <h3 className="mb-1">Assigned To</h3>
          <p>{task.assignedTo ? task.assignedTo.userName : 'Not assigned'}</p>
        </div>
      </div>
    </div>
  )
}

export default TaskDetails