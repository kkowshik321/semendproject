import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './auth.css'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    const last = localStorage.getItem('last_signup')
    if (last) {
      const { email, password } = JSON.parse(last)
      setEmail(email)
      setPassword(password)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // simple validation against stored users and include username in signIn
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const ok = users.find(u => u.email === email && u.password === password)
    if (ok) {
      signIn({ email: ok.email, username: ok.username })
      navigate(from, { replace: true })
    } else {
      alert('Invalid credentials — try signing up')
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} aria-label="Sign in form">
        <h2>Welcome back</h2>
        <label>
          Email
          <input value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>
        <button className="primary" type="submit">Sign in</button>
        <p className="auth-footer">Don't have an account? <Link to="/signup">Sign up</Link></p>
      </form>
    </main>
  )
}
