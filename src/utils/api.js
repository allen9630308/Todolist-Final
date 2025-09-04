import axios from 'axios'

export const POST_SIGN_IN = 'users/sign_in'
export const POST_SIGN_UP = 'users/sign_up'
export const GET_USER_CHECKOUT = 'users/checkout'
export const POST_SIGN_OUT = 'users/sign_out'

export const GET_TODOS = 'todos'
export const POST_TODOS = 'todos'
export const PUT_TODOS = 'todos/{id}'
export const DELETE_TODOS = 'todos/{id}'
export const PATCH_TODOS = 'todos/{id}/toggle'

export function formatAPIUrl(path, params = {}) {
  let p = path
  for (const [k, v] of Object.entries(params)) {
    p = p.replace(`{${k}}`, v)
  }
  return p
}

const TOKEN_KEY = 'vue3-todolist-token'

function sanitizeToken(raw) {
  if (!raw) return ''
  return String(raw)
    .trim()
    .replace(/^Bearer\s+/i, '')
    .replace(/^"+|"+$/g, '')
}

export function getToken() {
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${TOKEN_KEY}=([^;]+)`))
  const val = m ? decodeURIComponent(m[1]) : ''
  return sanitizeToken(val)
}

export function setToken(token, exp) {
  const jwt = sanitizeToken(token)
  const parts = [`${TOKEN_KEY}=${encodeURIComponent(jwt)}`, 'path=/', 'SameSite=Lax']

  if (typeof exp === 'number') {
    if (exp > 10_000_000) {
      parts.push(`expires=${new Date(exp * 1000).toUTCString()}`)
    } else {
      parts.push(`max-age=${exp}`)
    }
  } else if (typeof exp === 'string') {
    const d = new Date(exp)
    if (!Number.isNaN(d.getTime())) {
      parts.push(`expires=${d.toUTCString()}`)
    }
  }
  document.cookie = parts.join('; ')
}

export function clearToken() {
  document.cookie = `${TOKEN_KEY}=; max-age=0; path=/; SameSite=Lax`
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = token
    } else {
      delete config.headers.Authorization
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    if (status === 401) {
      clearToken()
      if (location.hash && location.hash.startsWith('#/')) {
        location.replace('#/login')
      } else {
        location.replace('/login')
      }
    }
    const payload = err?.response?.data || { message: err.message || 'Request Error' }
    return Promise.reject(payload)
  },
)

export const authApi = {
  signUp(data) {
    return api.post(POST_SIGN_UP, data).then((r) => r.data)
  },
  signIn(data) {
    return api.post(POST_SIGN_IN, data).then((r) => r.data)
  },
  signOut() {
    return api.post(POST_SIGN_OUT).then((r) => r.data)
  },
  checkout() {
    return api.get(GET_USER_CHECKOUT).then((r) => r.data)
  },
}

export const todoApi = {
  getTodos() {
    return api.get('/todos/').then((r) => r.data)
  },
  create({ content }) {
    return api.post('/todos/', { content }).then((r) => r.data)
  },
  update(id, { content }) {
    return api.put(`/todos/${id}`, { content }).then((r) => r.data)
  },
  remove(id) {
    return api.delete(`/todos/${id}`).then((r) => r.data)
  },
  toggle(id) {
    return api.patch(`/todos/${id}/toggle`).then((r) => r.data)
  },
}

export default api
