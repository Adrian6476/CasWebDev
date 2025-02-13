import axios from 'axios'

// Create an axios instance for interacting with the AI API.
// Base URL and authentication credentials are configured via environment variables.
const aiHttp = axios.create({
  baseURL: import.meta.env.VITE_OPENAI_API_BASE_URL || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
  }
})

// Request interceptor: Allows modification of the request configuration before sending.
aiHttp.interceptors.request.use(
  config => {
    // Optionally add custom logic here, such as logging or modifying headers.
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor: Processes responses uniformly.
aiHttp.interceptors.response.use(
  response => {
    // Return the data property from the response.
    return response.data
  },
  error => {
    // Handle errors and provide meaningful error messages.
    if (error.response) {
      console.error('AI API Error:', error.response.data)
      return Promise.reject(new Error(error.response.data.error?.message || 'AI service encountered an error'))
    } else if (error.request) {
      console.error('Network Error:', error.request)
      return Promise.reject(new Error('Network error: Please check your internet connection'))
    } else {
      console.error('Request Error:', error.message)
      return Promise.reject(error)
    }
  }
)

export default aiHttp
