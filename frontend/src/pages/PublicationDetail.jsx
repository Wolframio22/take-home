import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const API_BASE = 'http://127.0.0.1:5000/api'

export default function PublicationDetail() {
  const { id } = useParams()
  const [publication, setPublication] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublicationDetail()
  }, [id])

  const fetchPublicationDetail = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/publications/${id}`)
      const data = await response.json()
      setPublication(data)
    } catch (error) {
      console.error('Error fetching publication detail:', error)
    }
    setLoading(false)
  }

  if (loading) return <p>Loading...</p>
  if (!publication) return <p>Publication not found</p>

  return (
    <div className="detail-view">
      <Link to="/publications" className="back-link">← Back to Publications</Link>
      
      <h2>Publication Details</h2>
      
      <div className="detail-section">
        <h3>Publication Information</h3>
        <dl className="detail-list">
          <dt>Source:</dt>
          <dd>{publication.source}</dd>
          
          <dt>Date:</dt>
          <dd>{new Date(publication.date).toLocaleDateString()}</dd>
          
          <dt>Status:</dt>
          <dd><span className="badge">{publication.status}</span></dd>
          
          <dt>Is Correction:</dt>
          <dd>{publication.is_correction ? 'Yes' : 'No'}</dd>
          
          {publication.milestones && (
            <>
              <dt>Milestones:</dt>
              <dd>{publication.milestones}</dd>
            </>
          )}
          
          <dt>URL:</dt>
          <dd>
            <a href={publication.url} target="_blank" rel="noopener noreferrer">
              View Document ↗
            </a>
          </dd>
        </dl>
      </div>

      <div className="detail-section">
        <h3>Associated Projects ({publication.projects?.length || 0})</h3>
        {publication.projects && publication.projects.length > 0 ? (
          <div className="items-list">
            {publication.projects.map((project) => (
              <div key={project.uuid} className="list-item">
                <Link to={`/projects/${project.uuid}`} className="item-title">
                  {project.name}
                </Link>
                <div className="item-meta">
                  <span className="badge">{project.type}</span>
                  {project.capacity_value && (
                    <span>{project.capacity_value} {project.capacity_units}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No associated projects</p>
        )}
      </div>
    </div>
  )
}
