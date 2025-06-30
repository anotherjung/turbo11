import { NextRequest, NextResponse } from 'next/server'
import { appRouter } from '@repo/orpc'

/**
 * ORPC API route handler for Next.js App Router
 * Handles all ORPC requests at /api/orpc/[...segments]
 * 
 * This handler provides a unified API endpoint for all ORPC procedures
 * including user management and post management operations.
 */

/**
 * Handle ORPC requests
 */
async function handleORPCRequest(
  request: NextRequest,
  { params }: { params: Promise<{ segments: string[] }> }
) {
  try {
    const { segments } = await params
    const method = request.method
    const url = new URL(request.url)
    
    // Parse the procedure path from segments
    const procedurePath = segments.join('.')
    
    // Get request body for POST requests
    let input = {}
    if (method === 'POST') {
      try {
        const body = await request.json()
        input = body.input || body
      } catch (error) {
        // Handle cases where there's no JSON body
        input = {}
      }
    } else if (method === 'GET') {
      // For GET requests, parse query parameters as input
      const searchParams = url.searchParams
      input = Object.fromEntries(searchParams.entries())
    }

    // Route to the appropriate procedure
    const pathParts = procedurePath.split('.')
    
    if (pathParts.length < 2) {
      return NextResponse.json(
        { error: { message: 'Invalid procedure path' } },
        { status: 400 }
      )
    }

    const [routerName, procedureName] = pathParts
    
    if (!routerName || !procedureName) {
      return NextResponse.json(
        { error: { message: 'Invalid procedure path' } },
        { status: 400 }
      )
    }
    
    // Get the router (user or post)
    const router = (appRouter as any)[routerName]
    if (!router) {
      return NextResponse.json(
        { error: { message: `Router '${routerName}' not found` } },
        { status: 404 }
      )
    }

    // Get the procedure
    const procedure = router[procedureName]
    if (!procedure || typeof procedure.handler !== 'function') {
      return NextResponse.json(
        { error: { message: `Procedure '${procedureName}' not found` } },
        { status: 404 }
      )
    }

    // Execute the procedure
    const result = await procedure.handler({ input })
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('ORPC Handler Error:', error)
    
    return NextResponse.json(
      { 
        error: { 
          message: error instanceof Error ? error.message : 'Internal server error',
          code: 'INTERNAL_ERROR'
        } 
      },
      { status: 500 }
    )
  }
}

// Export for all HTTP methods that ORPC supports
export const GET = handleORPCRequest
export const POST = handleORPCRequest
export const PUT = handleORPCRequest
export const PATCH = handleORPCRequest
export const DELETE = handleORPCRequest

// Configure runtime for the API route
export const runtime = 'nodejs'