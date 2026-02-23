import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './navbar.css'

export default function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="nav">
      <div className="nav-left">
        <NavLink to="/" className="brand">Activity Log</NavLink>
        <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user">{user.username || user.email}</span>
            <button className="btn" onClick={signOut}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/signin" className="btn">Sign in</NavLink>
            <NavLink to="/signup" className="btn btn-primary">Sign up</NavLink>
          </>
        )}
      </div>
    </nav>
  )
}
