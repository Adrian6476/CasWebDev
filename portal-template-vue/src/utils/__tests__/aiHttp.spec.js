import { describe, it, expect } from 'vitest'
import aiHttp from '../aiHttp'

describe('aiHttp', () => {
  it('should have correct timeout', () => {
    expect(aiHttp.defaults.timeout).toBe(30000)
  })

  it('should have the Content-Type header set', () => {
    const contentType =
      aiHttp.defaults.headers['Content-Type'] || aiHttp.defaults.headers.common['Content-Type']
    expect(contentType).toBe('application/json')
  })

  it('should have interceptors applied', () => {
    expect(aiHttp.interceptors.request.handlers.length).toBeGreaterThan(0)
    expect(aiHttp.interceptors.response.handlers.length).toBeGreaterThan(0)
  })
})
