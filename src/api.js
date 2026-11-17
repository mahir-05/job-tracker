// All calls to the Django REST API live here, so components don't need to know URLs.
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  // DELETE returns 204 No Content, so there is no JSON to read.
  return response.status === 204 ? null : response.json()
}

export function getApplications() {
  return request('/applications/')
}

export function createApplication(application) {
  return request('/applications/', {
    method: 'POST',
    body: JSON.stringify(application)
  })
}

export function updateApplication(id, changes) {
  return request(`/applications/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(changes)
  })
}

export function deleteApplication(id) {
  return request(`/applications/${id}/`, { method: 'DELETE' })
}
