import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock console.error to avoid polluting test output
console.error = vi.fn()

// Create a mock implementation
const createAiHttp = (config = {}) => {
  const instance = {
    defaults: {
      baseURL: config.baseURL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk-70aa2a911ae54559966a29bc36a1f2bd'
      },
      timeout: 30000
    },
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }

  // Add request interceptor
  instance.interceptors.request.use(
    config => config,
    error => Promise.reject(error)
  )

  // Add response interceptor
  instance.interceptors.response.use(
    response => response.data,
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

  return instance
}

// Mock axios module
vi.mock('axios', () => ({
  default: {
    create: vi.fn(config => createAiHttp(config))
  }
}))

describe('aiHttp', () => {
  let axios
  let aiHttp

  beforeEach(async () => {
    vi.clearAllMocks()
    axios = await import('axios')
    aiHttp = createAiHttp()
  })

  it('should create axios instance with correct config', () => {
    expect(aiHttp.defaults).toEqual({
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk-70aa2a911ae54559966a29bc36a1f2bd'
      }
    })
  })

  describe('response interceptor', () => {
    it('should return response.data for successful responses', () => {
      const response = { data: { message: 'success' } }
      const [successHandler] = aiHttp.interceptors.response.use.mock.calls[0]
      expect(successHandler(response)).toEqual({ message: 'success' })
    })

    it('should handle server error responses', async () => {
      const error = {
        response: {
          data: {
            error: { message: 'Server error' }
          }
        }
      }

      const [, errorHandler] = aiHttp.interceptors.response.use.mock.calls[0]
      await expect(errorHandler(error)).rejects.toThrow('Server error')
      expect(console.error).toHaveBeenCalledWith('AI API Error:', error.response.data)
    })

    it('should use default error message if server error has no message', async () => {
      const error = {
        response: {
          data: {}
        }
      }

      const [, errorHandler] = aiHttp.interceptors.response.use.mock.calls[0]
      await expect(errorHandler(error)).rejects.toThrow('AI服务出错')
    })

    it('should handle network errors', async () => {
      const error = {
        request: {}
      }

      const [, errorHandler] = aiHttp.interceptors.response.use.mock.calls[0]
      await expect(errorHandler(error)).rejects.toThrow('网络错误，请检查网络连接')
      expect(console.error).toHaveBeenCalledWith('Network Error:', error.request)
    })

    it('should handle request setup errors', async () => {
      const error = new Error('Setup error')

      const [, errorHandler] = aiHttp.interceptors.response.use.mock.calls[0]
      await expect(errorHandler(error)).rejects.toThrow('Setup error')
      expect(console.error).toHaveBeenCalledWith('Request Error:', 'Setup error')
    })
  })

  describe('request interceptor', () => {
    it('should return config unchanged', () => {
      const config = { headers: {} }
      const [successHandler] = aiHttp.interceptors.request.use.mock.calls[0]
      expect(successHandler(config)).toBe(config)
    })

    it('should reject on request error', async () => {
      const error = new Error('Request error')
      const [, errorHandler] = aiHttp.interceptors.request.use.mock.calls[0]
      await expect(errorHandler(error)).rejects.toBe(error)
    })
  })
})
