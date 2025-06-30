import { createClient, type AppRouter } from '@repo/orpc'

/**
 * ORPC client configuration for the web application
 * 
 * This client is configured to communicate with the ORPC API routes
 * and provides type-safe access to all procedures defined in the appRouter.
 */

/**
 * Base URL for API requests
 * In production, this should be your actual domain
 */
const getBaseUrl = () => {
  // In browser, use relative URLs
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // On server, use environment variable or fallback to localhost
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  
  return 'http://localhost:3000'
}

/**
 * Get authentication headers
 */
const getAuthHeaders = () => {
  const headers: Record<string, string> = {}
  
  // Add auth token if available (client-side only)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

/**
 * Main ORPC client instance using the createClient utility from @repo/orpc
 * Provides full type safety and automatic error handling
 */
export const orpc = createClient({
  baseUrl: `${getBaseUrl()}/api/orpc`,
  headers: getAuthHeaders,
  timeout: 30000, // 30 seconds
  enableRetries: true,
  maxRetries: 3,
})

/**
 * Type-safe client instance
 * Use this in your components for full TypeScript support
 */
export default orpc

/**
 * Export the AppRouter type for use in other files
 */
export type { AppRouter }

/**
 * ORPC client error class
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
 * Utility functions for client-side operations
 */
export const clientUtils = {
  /**
   * Check if we're running in the browser
   */
  isBrowser: () => typeof window !== 'undefined',
  
  /**
   * Get current user token from localStorage
   */
  getAuthToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token')
    }
    return null
  },
  
  /**
   * Set auth token in localStorage
   */
  setAuthToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token)
    }
  },
  
  /**
   * Remove auth token from localStorage
   */
  removeAuthToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token')
    }
  },
}

/**
 * Re-export client from @repo/orpc for convenience
 */
export type ORPCClient = ReturnType<typeof createClient>