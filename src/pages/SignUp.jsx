import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './auth.css'

export default function SignUp() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // store signup into localStorage to prefill login
    const cred = { username, email, password }
    localStorage.setItem('last_signup', JSON.stringify(cred))
    // also store a simple users list
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    users.push(cred)
    localStorage.setItem('users', JSON.stringify(users))
    navigate('/signin')
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} aria-label="Sign up form">
        <h2>Create account</h2>
        <label>
          Username
          <input value={username} onChange={e=>setUsername(e.target.value)} required aria-required="true" />
        </label>
        <label>
          Email
          <input value={email} onChange={e=>setEmail(e.target.value)} required aria-required="true" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required aria-required="true" />
        </label>
        <button className="primary" type="submit">Sign up</button>
      </form>
    </main>
  )
}
