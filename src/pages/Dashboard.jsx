import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FixedSizeList as List } from 'react-window'
import { useLocation, useNavigate, NavLink } from 'react-router-dom'
import Filters from '../components/Filters'
import LogItem from '../components/LogItem'
import './dashboard.css'

function generateRandomLog(i){
  const levels = ['info','warn','error','debug']
  const events = ['User login','File uploaded','Payment processed','Permission change','Profile updated']
  // Telugu / South-Indian common names
  const users = ['Raju','Sai','Anil','Lakshmi','Sowmya','Divya','Ramu','Vamsi','Suresh','Radha']
  const status = Math.random() > 0.5 ? 'success' : 'fail'
  const level = levels[Math.floor(Math.random()*levels.length)]
  const event = events[Math.floor(Math.random()*events.length)]
  const username = users[Math.floor(Math.random()*users.length)]
  // mark some users as active randomly
  const isActive = Math.random() > 0.7
  const user = { id: 'u-'+(Math.floor(Math.random()*1000)), name: username, active: isActive }
  const ip = `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`
  return { id: 'log-'+Date.now()+'-'+i, level, event, user, ipaddress: ip, status, text:`${event} by ${user.name}`, time: new Date().toISOString() }
}

export default function Dashboard(){
  const [logs, setLogs] = useState(()=>{
    // initial bulk
    return Array.from({length:200},(_,i)=>generateRandomLog(i))
  })
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('all')
  const [status, setStatus] = useState('all')
  const location = useLocation()
  const navigate = useNavigate()
  const [transitioning, setTransitioning] = useState(false)
  const LEVELS = ['all','info','warn','error','debug']
  const STATUSES = ['all','success','fail','active']

  useEffect(()=>{
    const id = setInterval(()=>{
      setLogs(prev=>{
        const next = [generateRandomLog(prev.length), ...prev]
        // keep list bounded for demo
        return next.slice(0,1000)
      })
    }, 2500)
    return ()=>clearInterval(id)
  },[])

  // sync level from query string when navigating via navbar links
  useEffect(()=>{
    const params = new URLSearchParams(location.search)
    const q = params.get('level') || 'all'
    if (q !== level) {
      setTransitioning(true)
      setLevel(q)
      const t = setTimeout(()=>setTransitioning(false), 300)
      return ()=>clearTimeout(t)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[location.search])

  const filtered = useMemo(()=>{
    return logs.filter(l=>{
      if (level!=='all' && l.level!==level) return false
      // 'active' is a special filter that selects entries where the user is marked active
      if (status === 'active') {
        if (!l.user || !l.user.active) return false
      } else if (status!=='all' && l.status!==status) return false
      if (query && !(l.text.toLowerCase().includes(query.toLowerCase()) || (l.event && l.event.toLowerCase().includes(query.toLowerCase())))) return false
      return true
    })
  },[logs, query, level, status])

  const Row = ({index, style}) => (
    <div style={style}>
      <LogItem log={filtered[index]} />
    </div>
  )

  const { user } = useAuth()

  // metrics for sidebar cards (computed from full logs)
  const totalEvents = logs.length
  const successCount = logs.filter(l=>l.status==='success').length
  const failedCount = logs.filter(l=>l.status==='fail').length
  const activeUsers = new Set(logs.filter(l=>l.user && l.user.active).map(l=>l.user.name)).size

  // update URL when level changes from Filters so navbar + URL stay in sync
  useEffect(()=>{
    const params = new URLSearchParams(location.search)
    if ((level === 'all' && params.get('level')) || (level !== 'all' && params.get('level') !== level)){
      const search = level === 'all' ? '' : `?level=${level}`
      navigate({ pathname: '/dashboard', search }, { replace: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[level])

  return (
    <div className={`dashboard-root level-${level}`}>
      <aside className="dashboard-sidebar">
        <Filters query={query} onQuery={setQuery} level={level} onLevel={setLevel} count={filtered.length}
          totals={{ totalEvents, successCount, failedCount, activeUsers }} />
      </aside>
      <section className="dashboard-main" aria-live="polite">
        <header className="dashboard-header">
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <h2 style={{margin:0}}>Activity Log</h2>
            <div className="levels">
              {LEVELS.map(l => (
                <NavLink key={l} to={`/dashboard${l==='all' ? '' : `?level=${l}`}`} className={({isActive})=>"level-link" + (isActive? ' active':'') }>
                  {l.toUpperCase()}
                </NavLink>
              ))}
            </div>
            <div style={{marginLeft:8}}>
              <label style={{fontSize:12,display:'block',color:'#334'}} htmlFor="status-select">Status</label>
              <select id="status-select" value={status} onChange={e=>setStatus(e.target.value)} style={{padding:6,borderRadius:6}}>
                {STATUSES.map(s=> (
                  <option key={s} value={s}>{s === 'active' ? 'Active Users' : (s.charAt(0).toUpperCase()+s.slice(1))}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div className="summary">Showing {filtered.length} entries</div>
            {user && <div className="welcome">Welcome back, {user.username || user.email} 👋</div>}
          </div>
        </header>
        <div className="log-columns" style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 120px',gap:12,padding:'8px 12px',fontWeight:700,color:'#2b6cb0'}}>
          <div>Event</div>
          <div>User</div>
          <div>IP Address</div>
          <div>Status</div>
        </div>
        <div className={`log-list ${transitioning? 'transitioning':''}`} role="list">
          <List height={620} itemCount={filtered.length} itemSize={72} width={'100%'}>
            {Row}
          </List>
        </div>
      </section>
    </div>
  )
}
