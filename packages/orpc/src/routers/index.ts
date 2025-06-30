import { userRouter } from './user'
import { postRouter } from './post'

/**
 * Main application router combining all domain routers
 */
export const appRouter = {
  user: userRouter,
  post: postRouter,
}

/**
 * App router type for client-side type inference
 */
export type AppRouter = typeof appRouter

// Export individual routers for flexibility
export { userRouter, postRouter }