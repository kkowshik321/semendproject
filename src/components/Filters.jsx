import './filters.css'

export default function Filters({ query, onQuery, level, onLevel, count, totals = {} }){
  return (
    <div className="filters">
      <h3>Overview</h3>
      <div className="cards">
        <div className="card">
          <div className="card-title">Total Events</div>
          <div className="card-value">{totals.totalEvents ?? 0}</div>
        </div>
        <div className="card">
          <div className="card-title">Success</div>
          <div className="card-value">{totals.successCount ?? 0}</div>
        </div>
        <div className="card">
          <div className="card-title">Failed</div>
          <div className="card-value">{totals.failedCount ?? 0}</div>
        </div>
        <div className="card">
          <div className="card-title">Active Users</div>
          <div className="card-value">{totals.activeUsers ?? 0}</div>
        </div>
      </div>

      <h3 style={{marginTop:12}}>Filters</h3>
      <label className="filter-row">
        Search
        <input aria-label="Search logs" value={query} onChange={e=>onQuery(e.target.value)} />
      </label>
      <label className="filter-row">
        Level
        <select value={level} onChange={e=>onLevel(e.target.value)}>
          <option value="all">All</option>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
          <option value="debug">Debug</option>
        </select>
      </label>
      <div className="filter-summary">Matches: {count}</div>
    </div>
  )
}
