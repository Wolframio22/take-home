import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'http://127.0.0.1:5000/api'

export default function PublicationList() {
  const [publications, setPublications] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [loading, setLoading] = useState(false)

  // Debounced inputs
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [debouncedSource, setDebouncedSource] = useState('')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 500)
    return () => clearTimeout(timer)
  }, [search])

  // Debounce source
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSource(sourceFilter.trim()), 500)
    return () => clearTimeout(timer)
  }, [sourceFilter])

  // Fetch when any filter changes
  useEffect(() => {
    fetchPublications()
  }, [debouncedSearch, statusFilter, debouncedSource])

  const fetchPublications = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedSearch)    params.append('search', debouncedSearch)
      if (statusFilter)       params.append('status', statusFilter)
      if (debouncedSource)    params.append('source', debouncedSource)

      const response = await fetch(`${API_BASE}/publications?${params}`)
      const data = await response.json()
      setPublications(data)
    } catch {
      setPublications([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="list-view">
      <h2>Publications</h2>
      <div className="controls">
        <input
          type="text"
          placeholder="Search by source or URL..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="conditionally_approved">Conditionally Approved</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <input
          type="text"
          placeholder="Filter by source..."
          value={sourceFilter}
          onChange={e => setSourceFilter(e.target.value)}
          className="search-input"
        />
      </div>
      {loading ? (
        <p className="loading-text">Loading publications...</p>
      ) : (
        <>
          <p className="result-count">
            {publications.length} publications found
            {debouncedSearch && ` for "${debouncedSearch}"`}
            {debouncedSource && ` / source: "${debouncedSource}"`}
          </p>
          <div className="items-list">
            {publications.length > 0 ? (
              publications.map(pub => (
                <div key={pub.uuid} className="list-item">
                  <Link to={`/publications/${pub.uuid}`} className="item-title">
                    {pub.source} – {new Date(pub.date).toLocaleDateString()}
                  </Link>
                  <div className="item-meta">
                    <span className="badge">{pub.status}</span>
                    {pub.is_correction && <span className="badge correction">Correction</span>}
                    <span>{pub.project_count || 0} projects</span>
                  </div>
                  {pub.url && (
                    <a href={pub.url} target="_blank" rel="noopener noreferrer" className="external-link">
                      View Document ↗
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: '#999', fontStyle: 'italic' }}>
                No publications found. Adjust your filters.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
