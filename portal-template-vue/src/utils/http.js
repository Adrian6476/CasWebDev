import axios from 'axios'

// Create axios instance
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptors
http.interceptors.request.use(
  config => {
    // Add any request modifications here
    // For example: adding auth tokens
    // config.headers.Authorization = `Bearer ${getToken()}`
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptors
http.interceptors.response.use(
  response => {
    // Handle successful responses
    return response.data
  },
  error => {
    // Handle API errors
    if (error.response) {
      // Server returned error code (4xx, 5xx)
      console.error('API Error:', error.response.data)
      return Promise.reject(new Error(error.response.data.message || 'An error occurred'))
    } else if (error.request) {
      // No response received
      console.error('Network Error:', error.request)
      return Promise.reject(new Error('Network error. Please check your connection.'))
    } else {
      // Request setup error
      console.error('Request Error:', error.message)
      return Promise.reject(error)
    }
  }
)

export default http
