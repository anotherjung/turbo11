import type { AppRouter } from './routers'

// @ts-ignore - Import issue with TypeScript module resolution
const { createORPCClient } = require('@orpc/client')
// @ts-ignore - Import issue with TypeScript module resolution  
const { ORPCLink } = require('@orpc/client/fetch')

/**
 * Configuration options for creating an ORPC client
 */
export interface ClientConfig {
  baseUrl?: string
  headers?: Record<string, string> | (() => Record<string, string>)
  timeout?: number
  enableRetries?: boolean
  maxRetries?: number
}

/**
 * Default client configuration
 */
const DEFAULT_CONFIG: Required<Omit<ClientConfig, 'headers'>> = {
  baseUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  timeout: 30000, // 30 seconds
  enableRetries: true,
  maxRetries: 3,
}

/**
 * Create an ORPC client for browser usage
 * Includes automatic retries, error handling, and browser-specific optimizations
 * 
 * @param config - Client configuration
 * @returns Typed ORPC client
 */
export function createClient(config: ClientConfig = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  const link = new ORPCLink({
    url: `${finalConfig.baseUrl}/api/orpc`,
    headers: typeof config.headers === 'function' ? config.headers : config.headers || {},
    // Add timeout and retry logic
    fetch: async (input, init) => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout)
      
      let lastError: Error | null = null
      let retries = 0
      
      while (retries <= (finalConfig.enableRetries ? finalConfig.maxRetries : 0)) {
        try {
          const response = await fetch(input, {
            ...init,
            signal: controller.signal,
          })
          
          clearTimeout(timeoutId)
          
          // If response is successful, return it
          if (response.ok) {
            return response
          }
          
          // If it's a client error (4xx), don't retry
          if (response.status >= 400 && response.status < 500) {
            return response
          }
          
          // For server errors (5xx), retry if enabled
          if (retries < finalConfig.maxRetries && finalConfig.enableRetries) {
            retries++
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000))
            continue
          }
          
          return response
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Network error')
          
          if (retries < finalConfig.maxRetries && finalConfig.enableRetries) {
            retries++
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000))
            continue
          }
          
          break
        }
      }
      
      clearTimeout(timeoutId)
      throw lastError || new Error('Request failed after retries')
    },
  })

  return createORPCClient(link) as any
}

/**
 * Browser-specific error handling
 */
export class ORPCClientError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'ORPCClientError'
  }
}

/**
 * Helper to handle ORPC errors consistently on the client
 */
export function handleClientError(error: unknown): ORPCClientError {
  if (error instanceof ORPCClientError) {
    return error
  }
  
  if (error instanceof Error) {
    return new ORPCClientError(error.message)
  }
  
  return new ORPCClientError('Unknown error occurred')
}

/**
 * React hooks for ORPC (if using with React)
 * These can be extended with libraries like TanStack Query
 */
export const clientUtils = {
  /**
   * Check if we're in a browser environment
   */
  isBrowser: typeof window !== 'undefined',
  
  /**
   * Get the current base URL
   */
  getBaseUrl: () => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    return 'http://localhost:3000'
  },
  
  /**
   * Create headers with authentication
   */
  createAuthHeaders: (token: string) => ({
    Authorization: `Bearer ${token}`,
  }),
  
  /**
   * Format errors for display
   */
  formatError: (error: unknown) => {
    const clientError = handleClientError(error)
    return {
      message: clientError.message,
      code: clientError.code,
      status: clientError.status,
    }
  },
}

// Export types for convenience
export type { AppRouter } from './routers'
export type ORPCClient = ReturnType<typeof createClient>