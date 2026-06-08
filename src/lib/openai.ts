import OpenAI from 'openai'

let client: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  const enabled = import.meta.env.VITE_ENABLE_OPENAI === 'true'

  if (!enabled) {
    throw new Error('AI service temporarily unavailable\nDashboard tools are still available: \nWeather\nTech News \nGitHub Activity\nCrypto Prices\nTask Management')
  }

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OpenAI key missing')
  }

  if (!client) {
    client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    })
  }

  return client
}

export const AGENT_INSTRUCTIONS =
  'You are a personal IT assistant. Use available tools whenever real-time data is needed. Always prefer tool results over assumptions. Be concise, professional, and actionable. When presenting data from tools, format it clearly for a busy IT professional.'
