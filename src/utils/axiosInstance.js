import axios from 'axios'
import { getAuth } from 'firebase/auth'
import { BASE_URL } from '../constants' 

const api = axios.create({
  baseURL: BASE_URL, 
})

api.interceptors.request.use(
  async (config) => {
    const auth = getAuth()
    const user = auth.currentUser

    if (user) {
      try {
        const token = await user.getIdToken(true)
        config.headers.Authorization = `Bearer ${token}`
      } catch (error) {
        console.error('Gagal mendapatkan Firebase ID Token:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api