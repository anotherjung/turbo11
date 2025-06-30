import type { AppRouter } from '@repo/orpc'

/**
 * ORPC client configuration for the docs application
 * 
 * This client provides type-safe API communication between the frontend
 * and backend using the ORPC router with Zod validation.
 */

/**
 * Get the base URL for API requests
 * Handles both development and production environments
 */
function getBaseUrl(): string {
  // In browser, use relative URL
  if (typeof window !== 'undefined') {
    return ''
  }
  
  // On server, need full URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:${process.env.PORT ?? 3000}`
  }
  
  // Fallback
  return 'http://localhost:3000'
}

/**
 * Simple HTTP client for ORPC API calls
 */
class ORPCClient {
  private baseUrl: string
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }
  
  private async call(path: string, input?: any, method: 'GET' | 'POST' = 'POST') {
    const url = `${this.baseUrl}/api/orpc/${path}`
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method === 'POST' ? JSON.stringify({ input }) : undefined,
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`ORPC call failed for ${path}:`, error)
      throw error
    }
  }
  
  user = {
    getUser: (input: { id: string }) => this.call('user.getUser', input),
    getUserByEmail: (input: { email: string }) => this.call('user.getUserByEmail', input),
    listUsers: (input?: { pagination?: any; filters?: any }) => this.call('user.listUsers', input),
    createUser: (input: any) => this.call('user.createUser', input),
    updateUser: (input: { id: string; data: any }) => this.call('user.updateUser', input),
    deleteUser: (input: { id: string }) => this.call('user.deleteUser', input),
  }
  
  post = {
    getPost: (input: { id: string }) => this.call('post.getPost', input),
    listPosts: (input?: { pagination?: any; filters?: any }) => this.call('post.listPosts', input),
    createPost: (input: any) => this.call('post.createPost', input),
    updatePost: (input: { id: string; data: any }) => this.call('post.updatePost', input),
    deletePost: (input: { id: string }) => this.call('post.deletePost', input),
    publishPost: (input: { id: string; published: boolean }) => this.call('post.publishPost', input),
    getPostStats: (input?: { authorId?: string }) => this.call('post.getPostStats', input),
  }
}

/**
 * Main ORPC client instance
 * Use this for all API calls in the docs application
 */
export const orpcClient = new ORPCClient(getBaseUrl())

/**
 * Type-safe ORPC client with full router type inference
 */
export type OrpcClient = typeof orpcClient

/**
 * Server-side ORPC client for SSR and server components
 * Use this when making API calls from server components or API routes
 */
export const serverOrpcClient = new ORPCClient(getBaseUrl())

/**
 * Utility functions for common ORPC operations
 */
export const orpcUtils = {
  /**
   * Handle ORPC errors consistently
   */
  handleError(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    return 'An unexpected error occurred'
  },

  /**
   * Check if a response is successful
   */
  isSuccess(response: any): response is { success: true; data: any } {
    return response && response.success === true
  },

  /**
   * Check if a response is an error
   */
  isError(response: any): response is { success: false; error: any } {
    return response && response.success === false
  },

  /**
   * Extract data from a successful response
   */
  getData<T>(response: { success: true; data: T } | { success: false; error: any }): T | null {
    return this.isSuccess(response) ? response.data : null
  },

  /**
   * Extract error from a failed response
   */
  getError(response: { success: true; data: any } | { success: false; error: any }): string | null {
    return this.isError(response) ? this.handleError(response.error) : null
  },
}

/**
 * Export the router type for type inference
 */
export type { AppRouter } from '@repo/orpc'