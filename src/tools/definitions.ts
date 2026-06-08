import type OpenAI from 'openai'

export const toolDefinitions: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getWeather',
      description: 'Get current weather for a city including temperature, humidity, and wind speed.',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'City name, e.g. Bangalore, London, New York',
          },
        },
        required: ['city'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getTechNews',
      description: 'Fetch latest technology news headlines.',
      parameters: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: 'Number of articles to fetch (default 5, max 10)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getGithubStats',
      description: 'Get GitHub profile stats, repository count, followers, and recent activity.',
      parameters: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'GitHub username. Uses configured default if omitted.',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getStockPrice',
      description: 'Get live stock price for a given ticker symbol.',
      parameters: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: 'Stock ticker symbol, e.g. AAPL, MSFT, GOOGL',
          },
        },
        required: ['symbol'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getCryptoPrice',
      description: 'Get cryptocurrency price and 24h change.',
      parameters: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: 'Crypto symbol or name, e.g. BTC, ETH, bitcoin',
          },
        },
        required: ['symbol'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'createTask',
      description: 'Create a new productivity task.',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Task title' },
        },
        required: ['title'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'deleteTask',
      description: 'Delete a task by its ID.',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Task ID to delete' },
        },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'completeTask',
      description: 'Mark a task as complete by its ID.',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Task ID to complete' },
        },
        required: ['id'],
      },
    },
  },
]
