import './filters.css'

export default function Filters({ query, onQuery, level, onLevel, count }){
  return (
    <div className="filters">
      <h3>Filters</h3>
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
