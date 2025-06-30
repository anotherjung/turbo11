# @repo/orpc

A comprehensive ORPC package for type-safe API communication with Zod validation, built for the Turborepo monorepo.

## Features

- 🔒 **End-to-End Type Safety**: Full TypeScript support from client to server
- 📝 **Zod Validation**: Runtime schema validation with comprehensive error handling
- 🚀 **Next.js Integration**: Seamless integration with Next.js App Router
- 🌐 **Universal Client**: Works in both browser and server environments
- 📦 **Monorepo Ready**: Optimized for Turborepo workspace usage
- 🎯 **Mock Data**: Built-in mock data for development and testing

## Quick Start

### Installation

This package is already configured in your monorepo. To use it in your apps:

```json
{
  "dependencies": {
    "@repo/orpc": "workspace:*"
  }
}
```

### Server Setup (Next.js API Route)

```typescript
// app/api/orpc/[...segments]/route.ts
import { appRouter } from '@repo/orpc/server'
import { createORPCHandler } from '@orpc/next'

const handler = createORPCHandler({ router: appRouter })

export { handler as GET, handler as POST }
```

### Client Setup

```typescript
// lib/orpc.ts
import { createClient } from '@repo/orpc/client'

export const orpc = createClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
})
```

### Usage Example

```typescript
// In your components or pages
import { orpc } from '@/lib/orpc'

// List users with pagination
const users = await orpc.user.list({
  pagination: { page: 1, limit: 10 },
  filters: { role: 'admin' }
})

// Create a new user
const newUser = await orpc.user.create({
  email: 'user@example.com',
  password: 'SecurePass123!',
  name: 'John Doe'
})

// Update user
const updatedUser = await orpc.user.update({
  id: 'user-id',
  data: { name: 'Jane Doe' }
})
```

## API Reference

### Schemas

The package includes comprehensive Zod schemas for:

- **User Management**: `UserSchema`, `CreateUserInputSchema`, `UpdateUserInputSchema`
- **Post Management**: `PostSchema`, `CreatePostInputSchema`, `UpdatePostInputSchema`
- **Common Utilities**: `PaginationInputSchema`, `IdParamSchema`, `SearchQuerySchema`

### Procedures

#### User Procedures

- `user.get(id)` - Get user by ID
- `user.getByEmail(email)` - Get user by email
- `user.list(pagination?, filters?)` - List users with pagination
- `user.create(userData)` - Create new user
- `user.update(id, data)` - Update user
- `user.delete(id)` - Delete user

#### Post Procedures

- `post.get(id)` - Get post by ID
- `post.list(pagination?, filters?)` - List posts with pagination
- `post.create(postData)` - Create new post
- `post.update(id, data)` - Update post
- `post.delete(id)` - Delete post
- `post.publish(id, published)` - Toggle publish status
- `post.stats(authorId?)` - Get post statistics

## Development

### Building

```bash
pnpm build
```

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

### Development Mode

```bash
pnpm dev
```

## Architecture

### Package Structure

```
packages/orpc/
├── src/
│   ├── schemas/           # Zod schemas
│   │   ├── common.ts     # Common utilities
│   │   ├── user.ts       # User schemas
│   │   ├── post.ts       # Post schemas
│   │   └── index.ts      # Schema exports
│   ├── procedures/        # ORPC procedures
│   │   ├── user.ts       # User procedures
│   │   ├── post.ts       # Post procedures
│   │   └── index.ts      # Procedure exports
│   ├── routers/          # ORPC routers
│   │   ├── user.ts       # User router
│   │   ├── post.ts       # Post router
│   │   └── index.ts      # Main app router
│   ├── client.ts         # Browser client utilities
│   ├── server.ts         # Server client utilities
│   ├── types.ts          # TypeScript types
│   └── index.ts          # Main exports
├── dist/                 # Built output
├── package.json          # Package configuration
└── tsconfig.json         # TypeScript configuration
```

### Type Safety

The package provides full type safety through:

1. **Schema Validation**: Zod schemas validate all inputs and outputs
2. **TypeScript Types**: Generated types for all procedures and data
3. **Client Inference**: Automatic type inference in client calls
4. **Error Handling**: Typed error responses with validation details

### Mock Data

The package includes built-in mock data for development:

- Pre-populated users with different roles
- Sample posts with various statuses
- Realistic data relationships

## Integration Examples

### React Component

```typescript
'use client'

import { useState, useEffect } from 'react'
import { orpc } from '@/lib/orpc'
import type { User } from '@repo/orpc/schemas'

export function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const result = await orpc.user.list({
          pagination: { page: 1, limit: 10 }
        })
        setUsers(result.data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  )
}
```

### Server Component

```typescript
import { createServerClient } from '@repo/orpc/server'

const serverOrpc = createServerClient({
  baseUrl: process.env.INTERNAL_API_URL || 'http://localhost:3000'
})

export default async function UsersPage() {
  const users = await serverOrpc.user.list({
    pagination: { page: 1, limit: 5 }
  })

  return (
    <div>
      <h1>Users</h1>
      {users.data.map(user => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  )
}
```

## Error Handling

```typescript
import { ORPCClientError, handleClientError } from '@repo/orpc/client'

try {
  const user = await orpc.user.create({
    email: 'invalid-email',
    password: 'weak',
    name: 'Test User'
  })
} catch (error) {
  const clientError = handleClientError(error)
  
  if (clientError.code === 'VALIDATION_ERROR') {
    // Handle validation errors
    console.log('Validation failed:', clientError.details)
  } else {
    // Handle other errors
    console.log('Error:', clientError.message)
  }
}
```

## Contributing

When extending this package:

1. Add new schemas in `src/schemas/`
2. Create procedures in `src/procedures/`
3. Update routers in `src/routers/`
4. Export new types from `src/types.ts`
5. Update this README with new functionality

## Dependencies

- **@orpc/server**: 0.27.0 - ORPC server framework
- **@orpc/client**: 0.27.0 - ORPC client utilities
- **@orpc/next**: 0.27.0 - Next.js integration
- **zod**: ^3.22.4 - Schema validation

## License

MIT License - Part of the Turborepo monorepo.