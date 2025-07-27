// Create this new utility file: utils/apiRetry.ts

interface RetryOptions {
  maxAttempts?: number
  delay?: number
  backoff?: boolean
}

export const withRetry = async <T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const { maxAttempts = 3, delay = 1000, backoff = true } = options
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      // Don't retry on client errors (4xx) or final attempt
      if (attempt === maxAttempts || 
          (error.response?.status >= 400 && error.response?.status < 500)) {
        throw error
      }
      
      const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay
      console.log(`Attempt ${attempt} failed, retrying in ${waitTime}ms...`)
      
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
  
  throw new Error('Max retry attempts reached')
}