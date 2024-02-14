import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.BACKEND_URL,
})

export default apiClient