import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const API_BASE = 'http://127.0.0.1:5000/api'

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjectDetail()
  }, [id])

  const fetchProjectDetail = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/projects/${id}`)
      const data = await response.json()
      setProject(data)
    } catch (error) {
      console.error('Error fetching project detail:', error)
    }
    setLoading(false)
  }

  if (loading) return <p>Loading...</p>
  if (!project) return <p>Project not found</p>

  return (
    <div className="detail-view">
      <Link to="/projects" className="back-link">← Back to Projects</Link>
      
      <h2>{project.name}</h2>
      
      <div className="detail-section">
        <h3>Project Information</h3>
        <dl className="detail-list">
          <dt>Type:</dt>
          <dd><span className="badge">{project.type}</span></dd>
          
          {project.capacity_value && (
            <>
              <dt>Capacity:</dt>
              <dd>{project.capacity_value} {project.capacity_units}</dd>
            </>
          )}
          
          <dt>Created:</dt>
          <dd>{new Date(project.created_at).toLocaleDateString()}</dd>
          
          <dt>Updated:</dt>
          <dd>{new Date(project.updated_at).toLocaleDateString()}</dd>
        </dl>
      </div>

      <div className="detail-section">
        <h3>Associated Publications ({project.publications?.length || 0})</h3>
        {project.publications && project.publications.length > 0 ? (
          <div className="items-list">
            {project.publications.map((pub) => (
              <div key={pub.uuid} className="list-item">
                <Link to={`/publications/${pub.uuid}`} className="item-title">
                  {pub.source} - {new Date(pub.date).toLocaleDateString()}
                </Link>
                <div className="item-meta">
                  <span className="badge">{pub.status}</span>
                  {pub.is_correction && <span className="badge correction">Correction</span>}
                </div>
                <a href={pub.url} target="_blank" rel="noopener noreferrer" className="external-link">
                  View Document ↗
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p>No associated publications</p>
        )}
      </div>
    </div>
  )
}
