import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Documentation - ORPC',
  description: 'Comprehensive API documentation for the ORPC type-safe API',
}

/**
 * API Documentation Page
 * 
 * This page provides comprehensive documentation for the ORPC API
 * including all available endpoints, request/response schemas,
 * TypeScript examples, and error handling guidance.
 */
export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ORPC API Documentation</h1>
            <p className="text-lg text-gray-600">
              Type-safe API communication with Zod validation and full TypeScript support.
            </p>
          </header>

          {/* Quick Start */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Start</h2>
            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
                <code>{`// Install dependencies
npm install @orpc/client @orpc/server zod

// Import the client
import { orpcClient } from '@/lib/orpc'

// Make a type-safe API call
const user = await orpcClient.user.getUser({ id: 'user-123' })
console.log(user.name) // TypeScript knows this is a string`}</code>
              </pre>
            </div>
          </section>

          {/* Base URL */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Base URL</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <code className="text-blue-800 font-mono">
                {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/orpc
              </code>
            </div>
          </section>

          {/* Authentication */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Authentication</h2>
            <p className="text-gray-700 mb-4">
              Currently, the API uses mock data and doesn't require authentication. 
              In production, you would add authentication headers to your requests.
            </p>
            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
                <code>{`// Future authentication example
const authenticatedClient = createClient({
  baseUrl: '/api/orpc',
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Content-Type': 'application/json',
  },
})`}</code>
              </pre>
            </div>
          </section>

          {/* User Endpoints */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Endpoints</h2>
            
            {/* Get User */}
            <div className="mb-8 border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get User</h3>
              <p className="text-gray-700 mb-4">Retrieve a user by ID</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">TypeScript Example</h4>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
                      <code>{`const user = await orpcClient.user.getUser({
  id: 'user-123'
})

// Response type is automatically inferred:
// {
//   id: string
//   name: string
//   username: string | null
//   avatar: string | null
//   role: 'admin' | 'user'
//   createdAt: Date
//   updatedAt: Date
// }`}</code>
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">HTTP Request</h4>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
                      <code>{`POST /api/orpc/user.getUser
Content-Type: application/json

{
  "input": {
    "id": "user-123"
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Success Response</h4>
                <pre className="text-green-700 text-sm">
                  <code>{`{
  "id": "user-123",
  "name": "John Doe",
  "username": "johndoe",
  "avatar": null,
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}`}</code>
                </pre>
              </div>
            </div>

            {/* List Users */}
            <div className="mb-8 border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">List Users</h3>
              <p className="text-gray-700 mb-4">Retrieve users with pagination and filtering</p>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-green-400 text-sm">
                  <code>{`const users = await orpcClient.user.listUsers({
  pagination: {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  filters: {
    search: 'john',
    role: 'user',
    status: 'active'
  }
})

// Response includes pagination info
console.log(users.data) // Array of users
console.log(users.total) // Total count
console.log(users.hasNextPage) // Boolean`}</code>
                </pre>
              </div>
            </div>

            {/* Create User */}
            <div className="mb-8 border-l-4 border-green-500 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create User</h3>
              <p className="text-gray-700 mb-4">Create a new user account</p>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-green-400 text-sm">
                  <code>{`const newUser = await orpcClient.user.createUser({
  email: 'jane@example.com',
  password: 'SecurePass123!',
  name: 'Jane Smith',
  username: 'janesmith',
  role: 'user'
})

// Zod validation ensures type safety
// - email must be valid email format
// - password must be at least 8 characters
// - name must be 1-100 characters
// - username must be 3-30 characters, alphanumeric + underscore`}</code>
                </pre>
              </div>
            </div>

            {/* Update User */}
            <div className="mb-8 border-l-4 border-yellow-500 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Update User</h3>
              <p className="text-gray-700 mb-4">Update user information</p>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-green-400 text-sm">
                  <code>{`const updatedUser = await orpcClient.user.updateUser({
  id: 'user-123',
  data: {
    name: 'Jane Doe',
    avatar: 'https://example.com/avatar.jpg'
  }
})

// Only provided fields are updated
// All fields are optional in update operations`}</code>
                </pre>
              </div>
            </div>

            {/* Delete User */}
            <div className="mb-8 border-l-4 border-red-500 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete User</h3>
              <p className="text-gray-700 mb-4">Delete a user account</p>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-green-400 text-sm">
                  <code>{`const result = await orpcClient.user.deleteUser({
  id: 'user-123'
})

// Returns: { success: true }`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Post Endpoints */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Post Endpoints</h2>
            
            {/* Get Post */}
            <div className="mb-8 border-l-4 border-purple-500 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Post</h3>
              <p className="text-gray-700 mb-4">Retrieve a post by ID (increments view count)</p>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-green-400 text-sm">
                  <code>{`const post = await orpcClient.post.getPost({
  id: 'post-123'
})

// Response includes author information
console.log(post.title)
console.log(post.content)
console.log(post.author.name) // Populated author data`}</code>
                </pre>
              </div>
            </div>

            {/* List Posts */}
            <div className="mb-8 border-l-4 border-purple-500 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">List Posts</h3>
              <p className="text-gray-700 mb-4">Retrieve posts with advanced filtering</p>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-green-400 text-sm">
                  <code>{`const posts = await orpcClient.post.listPosts({
  pagination: {
    page: 1,
    limit: 10,
    sortBy: 'publishedAt',
    sortOrder: 'desc'
  },
  filters: {
    search: 'typescript',
    category: 'technology',
    tags: ['typescript', 'api'],
    published: true,
    authorId: 'author-123'
  }
})

// Rich filtering options:
// - Full-text search across title/content
// - Filter by author, category, tags
// - Filter by publication status
// - Date range filtering
// - Flexible sorting`}</code>
                </pre>
              </div>
            </div>

            {/* Create Post */}
            <div className="mb-8 border-l-4 border-green-500 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Post</h3>
              <p className="text-gray-700 mb-4">Create a new blog post</p>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-green-400 text-sm">
                  <code>{`const newPost = await orpcClient.post.createPost({
  title: 'My First Post',
  content: 'This is the content of my first post...',
  excerpt: 'A brief summary of the post',
  category: 'technology',
  tags: ['javascript', 'web-development'],
  status: 'draft',
  published: false,
  featuredImage: 'https://example.com/image.jpg'
})

// Auto-generates slug from title if not provided
// Validates all required fields with Zod schemas`}</code>
                </pre>
              </div>
            </div>

            {/* Publish Post */}
            <div className="mb-8 border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Publish Post</h3>
              <p className="text-gray-700 mb-4">Toggle post publication status</p>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-green-400 text-sm">
                  <code>{`const publishedPost = await orpcClient.post.publishPost({
  id: 'post-123',
  published: true
})

// Automatically sets publishedAt timestamp
// Updates post status to 'published'`}</code>
                </pre>
              </div>
            </div>

            {/* Get Post Stats */}
            <div className="mb-8 border-l-4 border-indigo-500 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Post Statistics</h3>
              <p className="text-gray-700 mb-4">Retrieve post analytics and statistics</p>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-green-400 text-sm">
                  <code>{`const stats = await orpcClient.post.getPostStats({
  authorId: 'author-123' // Optional: filter by author
})

// Returns comprehensive statistics:
// {
//   totalPosts: number
//   publishedPosts: number
//   draftPosts: number
//   totalViews: number
//   averageViewsPerPost: number
// }`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Error Handling */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error Handling</h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3">Error Response Format</h3>
              <p className="text-red-700 mb-4">
                All API errors follow a consistent format with descriptive error messages.
              </p>
              
              <div className="bg-red-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-red-300 text-sm">
                  <code>{`{
  "error": {
    "message": "User not found",
    "code": "NOT_FOUND",
    "path": ["user", "getUser"],
    "input": { "id": "invalid-id" }
  }
}`}</code>
                </pre>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
                <code>{`// Proper error handling in TypeScript
try {
  const user = await orpcClient.user.getUser({ id: 'invalid-id' })
  console.log(user)
} catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message)
    
    // Handle specific error types
    if (error.message.includes('not found')) {
      // Handle not found error
      console.log('User does not exist')
    }
  }
}

// Using utility functions from orpcUtils
import { orpcUtils } from '@/lib/orpc'

const response = await orpcClient.user.getUser({ id: 'user-123' })
  .catch(error => ({ success: false, error }))

if (orpcUtils.isError(response)) {
  const errorMessage = orpcUtils.getError(response)
  console.error('Error:', errorMessage)
} else {
  const userData = orpcUtils.getData(response)
  console.log('User:', userData)
}`}</code>
              </pre>
            </div>
          </section>

          {/* Common Error Codes */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Common Error Codes</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Error Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Common Causes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      VALIDATION_ERROR
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Input validation failed
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Invalid email format, missing required fields, data type mismatches
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      NOT_FOUND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Resource not found
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Invalid user ID, post ID, or other resource identifier
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      DUPLICATE_ERROR
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Resource already exists
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Email already registered, username taken, slug already exists
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      INTERNAL_ERROR
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Server error
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Database connection issues, unexpected server errors
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Schema Validation */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Schema Validation</h2>
            
            <p className="text-gray-700 mb-6">
              All API endpoints use Zod schemas for runtime validation. Here are the key validation rules:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">User Validation</h3>
                <ul className="text-blue-700 space-y-2 text-sm">
                  <li>• Email: Must be valid email format</li>
                  <li>• Password: Minimum 8 characters, at least one uppercase, lowercase, number, and special character</li>
                  <li>• Name: 1-100 characters, no leading/trailing spaces</li>
                  <li>• Username: 3-30 characters, alphanumeric + underscore only</li>
                  <li>• Role: Must be 'admin' or 'user'</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Post Validation</h3>
                <ul className="text-purple-700 space-y-2 text-sm">
                  <li>• Title: 1-200 characters, required</li>
                  <li>• Content: 1-50000 characters, required</li>
                  <li>• Slug: 3-100 characters, URL-safe format</li>
                  <li>• Category: Predefined list of categories</li>
                  <li>• Tags: Array of strings, max 10 tags</li>
                  <li>• Status: 'draft', 'published', or 'archived'</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Rate Limiting */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Rate Limiting</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Current Status</h3>
              <p className="text-yellow-700">
                Rate limiting is not currently implemented in this demo API. 
                In production, you should implement appropriate rate limiting to protect your API endpoints.
              </p>
            </div>
          </section>

          {/* Testing */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Testing the API</h2>
            
            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
                <code>{`// Example test using the ORPC client
import { orpcClient } from '@/lib/orpc'

// Test user creation and retrieval
async function testUserAPI() {
  try {
    // Create a test user
    const newUser = await orpcClient.user.createUser({
      email: 'test@example.com',
      password: 'TestPass123!',
      name: 'Test User',
      username: 'testuser'
    })
    
    console.log('Created user:', newUser.id)
    
    // Retrieve the user
    const retrievedUser = await orpcClient.user.getUser({
      id: newUser.id
    })
    
    console.log('Retrieved user:', retrievedUser.name)
    
    // List users
    const usersList = await orpcClient.user.listUsers({
      pagination: { page: 1, limit: 10 }
    })
    
    console.log('Total users:', usersList.total)
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testUserAPI()`}</code>
              </pre>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center text-gray-600">
              <p className="mb-2">
                This API is built with <strong>ORPC</strong> and <strong>Zod</strong> for type-safe, validated API communication.
              </p>
              <p className="text-sm">
                For more information, visit the{' '}
                <a href="https://orpc.io" className="text-blue-600 hover:text-blue-800 underline">
                  ORPC documentation
                </a>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}