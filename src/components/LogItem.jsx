import './logitem.css'

export default function LogItem({log}){
  if(!log) return null
  const cls = `log-item ${log.level}`
  return (
    <div className={cls} role="listitem" tabIndex={0} aria-label={`${log.level} - ${log.text}`}>
      <div className="log-meta">
        <div className="log-time">{new Date(log.time).toLocaleString()}</div>
        <div className="log-level">{log.level.toUpperCase()}</div>
      </div>
      <div className="log-text">{log.text}</div>
    </div>
  )
}
