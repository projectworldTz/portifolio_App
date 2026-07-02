import axios from 'axios'

const SAFE_METHODS = new Set(['get', 'head', 'options'])

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

// Only attach the XSRF header on state-changing requests — GET/HEAD don't need
// CSRF protection, and adding the header on every request forces a CORS
// preflight (OPTIONS) before every single call, doubling network round trips.
api.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase()
  config.withXSRFToken = !!method && !SAFE_METHODS.has(method)
  return config
})

export default api
