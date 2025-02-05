import axios from 'axios'

// Create axios instance for AI API
const aiHttp = axios.create({
  baseURL: import.meta.env.VITE_OPENAI_API_BASE_URL || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
  }
})

// Request interceptors
aiHttp.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptors
aiHttp.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response) {
      console.error('AI API Error:', error.response.data)
      return Promise.reject(new Error(error.response.data.error?.message || 'AI服务出错'))
    } else if (error.request) {
      console.error('Network Error:', error.request)
      return Promise.reject(new Error('网络错误，请检查网络连接'))
    } else {
      console.error('Request Error:', error.message)
      return Promise.reject(error)
    }
  }
)

export default aiHttp
