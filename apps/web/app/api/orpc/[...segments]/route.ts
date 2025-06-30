import { NextRequest, NextResponse } from 'next/server'
import { appRouter } from '@repo/orpc'

/**
 * ORPC API route handler for Next.js App Router
 * 
 * This handler processes all ORPC requests under /api/orpc/*
 * and routes them to the appropriate procedures in the appRouter.
 * 
 * @example
 * - POST /api/orpc/user/create -> appRouter.user.create procedure
 * - POST /api/orpc/user/list -> appRouter.user.list procedure
 * - POST /api/orpc/post/create -> appRouter.post.create procedure
 * 
 * The handler automatically:
 * - Routes requests to appropriate procedures
 * - Validates input with Zod schemas
 * - Handles errors consistently
 * - Provides type safety throughout
 */

interface RouteContext {
  params: Promise<{
    segments: string[]
  }>
}

/**
 * Create context for ORPC procedures
 */
function createContext(request: NextRequest) {
  // Extract auth token from headers
  const authorization = request.headers.get('authorization')
  const token = authorization?.replace('Bearer ', '')
  
  return {
    user: token ? { id: 'mock-user-id', token } : null,
    request,
  }
}

/**
 * Handle POST requests to ORPC procedures
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { segments } = await context.params
    
    if (!segments || segments.length < 2) {
      return NextResponse.json(
        { error: 'Invalid procedure path. Expected format: /api/orpc/[router]/[procedure]' },
        { status: 400 }
      )
    }

    const [routerName, procedureName] = segments
    
    // Get the appropriate router
    const router = appRouter[routerName as keyof typeof appRouter]
    if (!router) {
      return NextResponse.json(
        { error: `Router '${routerName}' not found` },
        { status: 404 }
      )
    }

    // Get the procedure from the router
    const procedure = router[procedureName as keyof typeof router]
    if (!procedure || typeof procedure !== 'function') {
      return NextResponse.json(
        { error: `Procedure '${routerName}.${procedureName}' not found` },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json().catch(() => ({}))
    const requestContext = createContext(request)
    
    // Execute the procedure with context
    const result = await procedure({
      input: body,
      ctx: requestContext,
    })
    
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('ORPC API Error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
    
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

/**
 * Handle GET requests (for procedures that support GET)
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { segments } = await context.params
    const { searchParams } = new URL(request.url)
    
    if (!segments || segments.length < 2) {
      return NextResponse.json(
        { error: 'Invalid procedure path. Expected format: /api/orpc/[router]/[procedure]' },
        { status: 400 }
      )
    }

    const [routerName, procedureName] = segments
    
    // Get the appropriate router
    const router = appRouter[routerName as keyof typeof appRouter]
    if (!router) {
      return NextResponse.json(
        { error: `Router '${routerName}' not found` },
        { status: 404 }
      )
    }

    // Get the procedure from the router
    const procedure = router[procedureName as keyof typeof router]
    if (!procedure || typeof procedure !== 'function') {
      return NextResponse.json(
        { error: `Procedure '${routerName}.${procedureName}' not found` },
        { status: 404 }
      )
    }

    // Convert search params to input object
    const input: Record<string, any> = {}
    for (const [key, value] of searchParams.entries()) {
      try {
        input[key] = JSON.parse(value)
      } catch {
        input[key] = value
      }
    }

    const requestContext = createContext(request)
    
    // Execute the procedure with context
    const result = await procedure({
      input,
      ctx: requestContext,
    })
    
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('ORPC API Error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
    
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}