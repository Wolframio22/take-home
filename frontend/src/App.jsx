import { Routes, Route, Link } from 'react-router-dom'
import ProjectList from './pages/ProjectList'
import ProjectDetail from './pages/ProjectDetail'
import PublicationList from './pages/PublicationList'
import PublicationDetail from './pages/PublicationDetail'
import './App.css'

function App() {
  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1>Projects & Publications</h1>
        <div className="nav-links">
          <Link to="/projects">Projects</Link>
          <Link to="/publications">Publications</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/publications" element={<PublicationList />} />
          <Route path="/publications/:id" element={<PublicationDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
