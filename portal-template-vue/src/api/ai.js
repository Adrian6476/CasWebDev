import aiHttp from '@/utils/aiHttp'

export const aiApi = {
  /**
   * Send message to AI and get response
   * @param {Array} messages - Array of message objects with role and content
   * @returns {Promise<Object>} - AI response
   */
  sendMessage: async messages => {
    try {
      const response = await aiHttp.post('/chat/completions', {
        model: import.meta.env.VITE_MODEL_ID,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      })

      return response.choices[0].message
    } catch (error) {
      console.error('AI Chat Error:', error)
      throw error
    }
  }
}
