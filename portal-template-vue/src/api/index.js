import http from '@/utils/http'

// News API for fetching news-related data.
export const newsApi = {
  /**
   * Retrieve a list of news items.
   * @param {number} page - The page number to retrieve.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<Array>} - A promise that resolves to an array of news items.
   */
  getNewsList: (page = 1, limit = 10) => {
    return http.get('/posts', {
      params: {
        _page: page,
        _limit: limit
      }
    })
  },

  /**
   * Retrieve detailed information for a specific news item.
   * @param {string|number} id - The unique identifier of the news item.
   * @returns {Promise<Object>} - A promise that resolves to the news item details.
   */
  getNewsDetail: id => {
    return http.get(`/posts/${id}`)
  },

  /**
   * Retrieve related news for demonstration purposes.
   * Note: This fetches 3 random posts instead of using actual related criteria.
   * @param {string|number} _id - The current news item ID (unused in demo).
   * @returns {Promise<Array>} - A promise that resolves to an array of related news items.
   */
  getRelatedNews: _id => {
    return http.get('/posts', {
      params: {
        _limit: 3,
        _start: Math.floor(Math.random() * 97) // Generate a random starting index.
      }
    })
  }
}

// Team API for fetching team-related data.
export const teamApi = {
  /**
   * Retrieve a list of team members.
   * @returns {Promise<Array>} - A promise that resolves to an array of team member objects.
   */
  getTeamMembers: () => {
    return http.get('/users')
  }
}

// Contact API for handling contact form submissions.
export const contactApi = {
  /**
   * Submit a contact form.
   * @param {Object} data - The form data to be sent.
   * @returns {Promise<Object>} - A promise that resolves to the server response.
   */
  sendContactForm: data => {
    return http.post('/posts', data)
  }
}
