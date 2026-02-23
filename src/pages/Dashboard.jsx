import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FixedSizeList as List } from 'react-window'
import { useLocation, useNavigate, NavLink } from 'react-router-dom'
import Filters from '../components/Filters'
import LogItem from '../components/LogItem'
import './dashboard.css'

function generateRandomLog(i){
  const levels = ['info','warn','error','debug']
  const level = levels[Math.floor(Math.random()*levels.length)]
  return { id: 'log-'+Date.now()+'-'+i, level, text:`Sample ${level} message #${i}`, time: new Date().toISOString() }
}

export default function Dashboard(){
  const [logs, setLogs] = useState(()=>{
    // initial bulk
    return Array.from({length:200},(_,i)=>generateRandomLog(i))
  })
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('all')
  const location = useLocation()
  const navigate = useNavigate()
  const [transitioning, setTransitioning] = useState(false)
  const LEVELS = ['all','info','warn','error','debug']

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
      if (query && !(l.text.toLowerCase().includes(query.toLowerCase()))) return false
      return true
    })
  },[logs, query, level])

  const Row = ({index, style}) => (
    <div style={style}>
      <LogItem log={filtered[index]} />
    </div>
  )

  const { user } = useAuth()

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
        <Filters query={query} onQuery={setQuery} level={level} onLevel={setLevel} count={filtered.length} />
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
          </div>
          <div>
            <div className="summary">Showing {filtered.length} entries</div>
            {user && <div className="welcome">Welcome back, {user.username || user.email} 👋</div>}
          </div>
        </header>
        <div className={`log-list ${transitioning? 'transitioning':''}`} role="list">
          <List height={620} itemCount={filtered.length} itemSize={72} width={'100%'}>
            {Row}
          </List>
        </div>
      </section>
    </div>
  )
}
