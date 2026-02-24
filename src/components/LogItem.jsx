import './logitem.css'

export default function LogItem({log}){
  if(!log) return null
  const cls = `log-item ${log.level}`
  return (
    <div className={cls} role="listitem" tabIndex={0} aria-label={`${log.level} - ${log.text}`}>
      <div className="col event">{log.event || log.text}</div>
      <div className="col user">{(log.user && log.user.name) || 'unknown'}</div>
      <div className="col ip">{log.ipaddress || '-'}</div>
      <div className={`col status ${log.status==='success' ? 'success' : 'fail'}`}>{log.status}</div>
    </div>
  )
}
