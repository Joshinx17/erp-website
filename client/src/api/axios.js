import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
})

API.interceptors.request.use((req) => {
  const user = localStorage.getItem('user')
  if (user) {
    const { token } = JSON.parse(user)
    if (token) req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default API
