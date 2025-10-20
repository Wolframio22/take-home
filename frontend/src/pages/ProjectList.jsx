import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'http://127.0.0.1:5000/api'

export default function ProjectList() {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 500)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    fetchProjects()
  }, [debouncedSearch, typeFilter, startDate, endDate])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedSearch)   params.append('search', debouncedSearch)
      if (typeFilter)        params.append('type', typeFilter)
      if (startDate)         params.append('start_date', startDate)
      if (endDate)           params.append('end_date', endDate)

      const res = await fetch(`${API_BASE}/projects?${params.toString()}`)
      setProjects(await res.json())
    } catch {
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="list-view">
      <h2>Projects</h2>
      <div className="controls">
        <input
          type="text"
          placeholder="Search by project name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="generation">Generation</option>
          <option value="grid">Grid</option>
          <option value="storage">Storage</option>
          <option value="demand">Demand</option>
          <option value="other">Other</option>
        </select>

        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="filter-select"
          />
        </label>

        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="filter-select"
          />
        </label>
      </div>

      {loading ? (
        <p className="loading-text">Loading projects...</p>
      ) : (
        <>
          <p className="result-count">
            {projects.length} projects found
            {debouncedSearch && ` for "${debouncedSearch}"`}
          </p>
          <div className="items-list">
            {projects.map(proj => (
              <div key={proj.uuid} className="list-item">
                <Link to={`/projects/${proj.uuid}`} className="item-title">
                  {proj.name}
                </Link>
                <div className="item-meta">
                  <span className="badge">{proj.type}</span>
                  {proj.capacity_value && (
                    <span>{proj.capacity_value} {proj.capacity_units}</span>
                  )}
                  <span>{proj.publication_count || 0} publications</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
)
}
