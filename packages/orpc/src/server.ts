import type { AppRouter } from './routers'

// @ts-ignore - Import issue with TypeScript module resolution
const { createORPCClient } = require('@orpc/client')
// @ts-ignore - Import issue with TypeScript module resolution  
const { ORPCLink } = require('@orpc/client/fetch')

/**
 * Configuration options for creating an ORPC server client
 */
export interface ServerClientConfig {
  baseUrl: string
  headers?: Record<string, string> | (() => Record<string, string>)
  timeout?: number
}

/**
 * Create an ORPC client for server-side usage
 * Useful for server-to-server communication or SSR
 * 
 * @param config - Client configuration
 * @returns Typed ORPC client
 */
export function createServerClient(config: ServerClientConfig) {
  const link = new ORPCLink({
    url: `${config.baseUrl}/api/orpc`,
    headers: typeof config.headers === 'function' ? config.headers : config.headers || {},
    // Add timeout if specified
    ...(config.timeout && { 
      fetch: (input, init) => {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), config.timeout)
        
        return fetch(input, {
          ...init,
          signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId))
      }
    }),
  })

  return createORPCClient(link) as any
}

/**
 * Server-side error handling utility
 */
export class ORPCServerError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'ORPCServerError'
  }
}

/**
 * Helper to handle ORPC errors consistently on the server
 */
export function handleORPCError(error: unknown): never {
  if (error instanceof Error) {
    throw new ORPCServerError(error.message)
  }
  throw new ORPCServerError('Unknown error occurred')
}

/**
 * Server-side response utilities
 */
export const serverUtils = {
  /**
   * Create a success response
   */
  success<T>(data: T) {
    return {
      success: true as const,
      data,
    }
  },

  /**
   * Create an error response
   */
  error(message: string, code?: string, details?: Record<string, any>) {
    return {
      success: false as const,
      error: {
        message,
        code,
        details,
      },
    }
  },
}

// Export the router for server setup
export { appRouter } from './routers'