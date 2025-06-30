// Re-export all schema types
export type * from './schemas'

// Re-export router types
export type { AppRouter } from './routers'

// Additional utility types for the API
export type RouterInput<T> = T extends (...args: any[]) => any
  ? Parameters<T>[0]
  : never

export type RouterOutput<T> = T extends (...args: any[]) => any
  ? Awaited<ReturnType<T>>
  : never

// Common API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, any>
}

// Client configuration types (base interface)
export interface BaseClientConfig {
  baseUrl: string
  headers?: Record<string, string>
  timeout?: number
}

// Server context type (can be extended for authentication, etc.)
export interface ServerContext {
  userId?: string
  userRole?: string
  headers?: Record<string, string>
}