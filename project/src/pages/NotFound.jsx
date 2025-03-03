import { Link } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">
        <FaHome /> Go Home
      </Link>
    </div>
  )
}

export default NotFound