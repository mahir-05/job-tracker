import './App.css'
import ApplicationCard from './ApplicationCard'
import { useState, useEffect } from 'react'

const STATUSES = ['Applied', 'Pending', 'Test Submitted', 'Interview', 'Offer', 'Rejected']

const STARTING_APPLICATIONS = [
  { id: 1, company: 'Sky', role: 'Emerging Tech Graduate Scheme', status: 'Pending' },
  { id: 2, company: 'TFL', role: 'Power Platform Graduate Scheme', status: 'Pending' },
  { id: 3, company: 'Wise', role: 'WiseStart Engineering', status: 'Test Submitted' }
]

function App() {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('applications')
    return saved ? JSON.parse(saved) : STARTING_APPLICATIONS
  })
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('Applied')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications))
  }, [applications])

  function handleSubmit(e) {
    e.preventDefault()
    if (!company.trim() || !role.trim()) return

    const newApplication = {
      id: Date.now(),
      company: company.trim(),
      role: role.trim(),
      status: status,
      dateAdded: new Date().toISOString()
    }

    setApplications([...applications, newApplication])
    setCompany('')
    setRole('')
    setStatus('Applied')
  }

  function updateStatus(id, newStatus) {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    )
  }

  function deleteApplication(id) {
    setApplications(applications.filter((app) => app.id !== id))
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

          {visibleApplications.length === 0 ? (
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
