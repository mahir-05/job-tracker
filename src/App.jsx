import './App.css'
import ApplicationCard from './ApplicationCard'
import { useState, useEffect } from 'react'
import * as api from './api'

const STATUSES = ['Applied', 'Pending', 'Test Submitted', 'Interview', 'Offer', 'Rejected']

function App() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('Applied')
  const [filter, setFilter] = useState('All')

  // Load applications from the API once, when the page first opens.
  useEffect(() => {
    api
      .getApplications()
      .then((data) => setApplications(data))
      .catch(() => setError('Could not load applications. Is the Django server running?'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!company.trim() || !role.trim()) return

    try {
      const saved = await api.createApplication({
        company: company.trim(),
        role: role.trim(),
        status: status
      })
      setApplications([...applications, saved])
      setCompany('')
      setRole('')
      setStatus('Applied')
      setError('')
    } catch {
      setError('Could not add the application. Please try again.')
    }
  }

  async function updateStatus(id, newStatus) {
    try {
      const updated = await api.updateApplication(id, { status: newStatus })
      setApplications(applications.map((app) => (app.id === id ? updated : app)))
      setError('')
    } catch {
      setError('Could not update the status. Please try again.')
    }
  }

  async function deleteApplication(id) {
    try {
      await api.deleteApplication(id)
      setApplications(applications.filter((app) => app.id !== id))
      setError('')
    } catch {
      setError('Could not delete the application. Please try again.')
    }
  }

  function countWithStatus(statusList) {
    return applications.filter((app) => statusList.includes(app.status)).length
  }

  const stats = [
    { key: 'total', label: 'Total', value: applications.length },
    { key: 'progress', label: 'In progress', value: countWithStatus(['Applied', 'Pending', 'Test Submitted']) },
    { key: 'interview', label: 'Interviews', value: countWithStatus(['Interview']) },
    { key: 'offer', label: 'Offers', value: countWithStatus(['Offer']) },
    { key: 'rejected', label: 'Rejected', value: countWithStatus(['Rejected']) }
  ]

  const visibleApplications =
    filter === 'All'
      ? applications
      : applications.filter((app) => app.status === filter)

  return (
    <div className="page">
      <nav className="navbar">
        <div className="nav-inner">
          <div className="brand">
            <span className="brand-logo">JT</span>
            <span className="brand-name">Job Tracker</span>
          </div>
          <span className="nav-meta">Graduate job search</span>
        </div>
      </nav>

      <main className="container">
        <header className="page-header">
          <h1>Applications</h1>
          <p className="subtitle">Track every application and see where each one stands.</p>
        </header>

        {error && <div className="error-banner">{error}</div>}

        <section className="stats">
          {stats.map((s) => (
            <div className="stat-card" key={s.key}>
              <span className="stat-label">
                <span className={`dot dot-${s.key}`}></span>
                {s.label}
              </span>
              <span className="stat-value">{s.value}</span>
            </div>
          ))}
        </section>

        <section className="panel">
          <h2 className="panel-title">Add an application</h2>
          <form className="add-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Company</span>
              <input
                placeholder="e.g. Monzo"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Role</span>
              <input
                placeholder="e.g. Graduate Software Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="primary-btn">Add application</button>
          </form>
        </section>

        <section className="panel list-panel">
          <div className="list-header">
            <h2 className="panel-title">Your applications</h2>
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All statuses ({applications.length})</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s} ({countWithStatus([s])})
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="empty">Loading applications...</p>
          ) : visibleApplications.length === 0 ? (
            <p className="empty">
              {applications.length === 0
                ? 'No applications yet. Add your first one above.'
                : `No applications with status "${filter}".`}
            </p>
          ) : (
            <ul className="list">
              {visibleApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  id={app.id}
                  company={app.company}
                  role={app.role}
                  status={app.status}
                  dateAdded={app.dateAdded}
                  statuses={STATUSES}
                  onStatusChange={updateStatus}
                  onDelete={deleteApplication}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
