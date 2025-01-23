import http from '@/utils/http'

// News API
export const newsApi = {
  /**
   * Get news list
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Array>}
   */
  getNewsList: (page = 1, limit = 10) => {
    return http.get(`https://jsonplaceholder.typicode.com/posts`, {
      params: {
        _page: page,
        _limit: limit
      }
    })
  },

  /**
   * Get news detail by ID
   * @param {string|number} id - News ID
   * @returns {Promise<Object>}
   */
  getNewsDetail: (id) => {
    return http.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
  },

  /**
   * Get related news
   * @param {string|number} id - Current news ID
   * @returns {Promise<Array>}
   */
  getRelatedNews: (id) => {
    // For demo, just get 3 random posts
    return http.get(`https://jsonplaceholder.typicode.com/posts`, {
      params: {
        _limit: 3,
        _start: Math.floor(Math.random() * 97) // Random start position
      }
    })
  }
}

// Team API
export const teamApi = {
  /**
   * Get team members
   * @returns {Promise<Array>}
   */
  getTeamMembers: () => {
    return http.get(`https://jsonplaceholder.typicode.com/users`)
  }
}

// Contact API
export const contactApi = {
  /**
   * Send contact form
   * @param {Object} data - Form data
   * @returns {Promise<Object>}
   */
  sendContactForm: (data) => {
    return http.post(`https://jsonplaceholder.typicode.com/posts`, data)
  }
}
