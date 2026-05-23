import { create } from 'zustand'
import api from '../services/api'

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,

  isAuthenticated: () => !!localStorage.getItem('token'),

  login: async (email, password) => {
    const response = await api.post('/auth/login/', { email, password })
    const { access } = response.data
    
    localStorage.setItem('token', access)
    
    // Получаем данные пользователя
    const userResponse = await api.get('/auth/me/')
    const user = userResponse.data
    
    localStorage.setItem('user', JSON.stringify(user))
    set({ token: access, user })
    
    return user
  },

  register: async (userData) => {
    const response = await api.post('/auth/register/', userData)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null })
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
}))

export default useAuthStore
