import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { authService, userService } from '../services/api'
import { FaUser } from 'react-icons/fa'

function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authService.getProfile();
        setProfile(data);
        setFormData({ userName: data.userName, email: data.email, password: '', confirmPassword: '' });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setUpdating(false);
      return;
    }

    if (!/@(gmail|outlook|yahoo)\.com$/.test(formData.email)) {
      setError('Email must be a valid provider');
      setUpdating(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      if (!userData.password) delete userData.password;

      await userService.updateUser(profile.id, userData);
      toast.success('Profile updated successfully');
      const { data } = await authService.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div>
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser />
        </div>
        <div className="profile-info">
          <h2>{profile.userName}</h2>
          <p>{profile.email}</p>
          <p>Role: {profile.role}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-3">Update Profile</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              id="userName"
              name="userName"
              className="form-control"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <small>Must end with @gmail.com, @outlook.com, or @yahoo.com</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">New Password (leave blank to keep current)</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile