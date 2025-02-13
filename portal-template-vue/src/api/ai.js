import aiHttp from '@/utils/aiHttp'

export const aiApi = {
  /**
   * Send message to AI and get response.
   * @param {Array} messages - Array of message objects with role and content.
   * @param {string} language - Current language (en/zh).
   * @returns {Promise<Object>} - AI response.
   */
  sendMessage: async (messages, language) => {
    try {
      // Get the system prompt corresponding to the current language.
      const promptKey = `VITE_AI_SYSTEM_PROMPT_${language.toUpperCase()}`
      const systemPrompt = import.meta.env[promptKey]

      // Add the system prompt as the first message.
      const systemMessage = {
        role: 'system',
        content: systemPrompt
      }

      const response = await aiHttp.post('/chat/completions', {
        model: import.meta.env.VITE_MODEL_ID,
        messages: [systemMessage, ...messages],
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
