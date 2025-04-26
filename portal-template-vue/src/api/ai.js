import aiHttp from '@/utils/aiHttp'

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Helper function to get request count from local storage
const getRequestCount = () => {
  const today = getTodayDate()
  const storedData = localStorage.getItem('aiRequestCount')
  if (storedData) {
    const { date, count } = JSON.parse(storedData)
    if (date === today) {
      return count
    }
  }
  // Reset count if date is different or no data exists
  localStorage.setItem('aiRequestCount', JSON.stringify({ date: today, count: 0 }))
  return 0
}

// Helper function to increment request count in local storage
const incrementRequestCount = () => {
  const today = getTodayDate()
  const count = getRequestCount()
  localStorage.setItem('aiRequestCount', JSON.stringify({ date: today, count: count + 1 }))
}

const MAX_REQUESTS_PER_DAY = 3

export const aiApi = {
  /**
   * Send message to AI and get response.
   * @param {Array} messages - Array of message objects with role and content.
   * @param {string} language - Current language (en/zh).
   * @returns {Promise<Object>} - AI response.
   */
  sendMessage: async (messages, language) => {
    const currentCount = getRequestCount()

    if (currentCount >= MAX_REQUESTS_PER_DAY) {
      // Return a message object indicating the limit is reached
      return {
        role: 'assistant',
        content: `防止被滥用，每日可用次数仅限${MAX_REQUESTS_PER_DAY}次。`
      }
    }

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

      // Increment count only on successful request
      incrementRequestCount()

      return response.choices[0].message
    } catch (error) {
      // Don't increment count if the API call itself failed
      console.error('AI Chat Error:', error)
      // Re-throw the original error for actual API failures
      throw error
    }
  }
}
