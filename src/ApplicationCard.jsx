const AVATAR_COLOURS = ['#dbeafe', '#dcfce7', '#fef3c7', '#f3e8ff', '#cffafe', '#fee2e2', '#e0e7ff', '#fce7f3']

function avatarColour(name) {
  const total = [...name].reduce((sum, letter) => sum + letter.charCodeAt(0), 0)
  return AVATAR_COLOURS[total % AVATAR_COLOURS.length]
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function ApplicationCard(props) {
  return (
    <li className="row">
      <div className="avatar" style={{ background: avatarColour(props.company) }}>
        {props.company.charAt(0).toUpperCase()}
      </div>

      <div className="row-info">
        <span className="row-company">{props.company}</span>
        <span className="row-role">
          {props.role}
          {props.dateAdded && <span className="row-date"> · Added {formatDate(props.dateAdded)}</span>}
        </span>
      </div>

      <select
        className="status-select"
        data-status={props.status}
        value={props.status}
        onChange={(e) => props.onStatusChange(props.id, e.target.value)}
        aria-label={`Status for ${props.company}`}
      >
        {props.statuses.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <button
        className="delete-btn"
        onClick={() => props.onDelete(props.id)}
        aria-label={`Delete ${props.company}`}
      >
        Delete
      </button>
    </li>
  )
}

export default ApplicationCard
