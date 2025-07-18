import axios from 'axios'

const API_BASE_URL = 'http://localhost:8088'
// const neon_d=https://car-rental-backend-ps2q.onrender.com

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (userData: any) => api.post('/users/register', userData),
  verify: (email: string, verificationCode: string) => 
    api.post('/users/verify', { email, verificationCode }),
  login: (email: string, password: string) => 
    api.post('/users/login', { email, password }),
}

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
}

export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id: number) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  update: (id: number, data: any) => api.put(`/events/${id}`, data),
  delete: (id: number) => api.delete(`/events/${id}`),
}

export const bookingAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id: number) => api.get(`/bookings/${id}`),
  create: (data: any) => api.post('/bookings', data),
  update: (id: number, data: any) => api.put(`/bookings/${id}`, data),
  delete: (id: number) => api.delete(`/bookings/${id}`),
}