/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

// Store interceptors
const interceptors = {
  request: null,
  response: null
}

// Mock process.env and import.meta.env before any imports
const envVars = {
  VITE_API_BASE_URL: ''
}

vi.stubGlobal('import', { meta: { env: envVars } })
vi.stubGlobal('process', { env: envVars })

// Mock axios with a function that will set the interceptors when they're registered
vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        interceptors: {
          request: {
            use: vi.fn((onFulfilled, onRejected) => {
              interceptors.request = {
                onFulfilled,
                onRejected
              }
            })
          },
          response: {
            use: vi.fn((onFulfilled, onRejected) => {
              interceptors.response = {
                onFulfilled,
                onRejected
              }
            })
          }
        }
      }))
    }
  }
})

describe('http', () => {
  let httpModule

  beforeEach(async () => {
    vi.clearAllMocks()
    interceptors.request = null
    interceptors.response = null

    // Import http module to trigger interceptor registration
    vi.resetModules()
    httpModule = await import('../http')
  })

  afterEach(() => {
    httpModule = null
  })

  it('should create axios instance with correct config', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: '',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })

  describe('request interceptor', () => {
    it('should pass through config', async () => {
      expect(interceptors.request).not.toBeNull()
      const config = { headers: {} }
      const result = await interceptors.request.onFulfilled(config)
      expect(result).toBe(config)
    })

    it('should reject on error', async () => {
      expect(interceptors.request).not.toBeNull()
      const error = new Error('Request error')
      await expect(interceptors.request.onRejected(error)).rejects.toBe(error)
    })
  })

  describe('response interceptor', () => {
    it('should return response data on success', () => {
      expect(interceptors.response).not.toBeNull()
      const response = { data: { key: 'value' } }
      const result = interceptors.response.onFulfilled(response)
      expect(result).toBe(response.data)
    })

    it('should handle server error responses', async () => {
      expect(interceptors.response).not.toBeNull()
      const error = {
        response: {
          data: {
            message: 'Server error'
          }
        }
      }
      await expect(interceptors.response.onRejected(error)).rejects.toThrow('Server error')
    })

    it('should handle network errors', async () => {
      expect(interceptors.response).not.toBeNull()
      const error = {
        request: {}
      }
      await expect(interceptors.response.onRejected(error)).rejects.toThrow(
        'Network error. Please check your connection.'
      )
    })

    it('should handle request setup errors', async () => {
      expect(interceptors.response).not.toBeNull()
      const error = new Error('Setup error')
      await expect(interceptors.response.onRejected(error)).rejects.toBe(error)
    })

    it('should use default error message if server error has no message', async () => {
      expect(interceptors.response).not.toBeNull()
      const error = {
        response: {
          data: {}
        }
      }
      await expect(interceptors.response.onRejected(error)).rejects.toThrow('An error occurred')
    })
  })
})
