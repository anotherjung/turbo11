import { z } from 'zod'
import { os } from '@orpc/server'
import {
  UserSchema,
  CreateUserInputSchema,
  UpdateUserInputSchema,
  UserFiltersSchema,
  PublicUserSchema,
  type User,
  type CreateUserInput,
  type UpdateUserInput,
} from '../schemas/user'
import {
  PaginationInputSchema,
  IdParamSchema,
  createPaginationOutputSchema,
  type PaginationOutput,
} from '../schemas/common'

// Mock user data store (replace with real database later)
const mockUsers: Map<string, User> = new Map()

// Helper to generate mock user
const createMockUser = (input: CreateUserInput): User => {
  const now = new Date()
  const user: User = {
    id: crypto.randomUUID(),
    email: input.email,
    name: input.name,
    username: input.username,
    avatar: input.avatar || null,
    role: input.role || 'user',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  }
  mockUsers.set(user.id, user)
  return user
}

// Initialize with some mock data
if (mockUsers.size === 0) {
  createMockUser({
    email: 'admin@example.com',
    password: 'Admin123!',
    name: 'Admin User',
    username: 'admin',
    role: 'admin',
  })
  createMockUser({
    email: 'john@example.com',
    password: 'User123!',
    name: 'John Doe',
    username: 'johndoe',
  })
}

/**
 * Get user by ID
 */
export const getUser = os
  .input(IdParamSchema)
  .handler(async ({ input }) => {
    const user = mockUsers.get(String(input.id))
    if (!user) {
      throw new Error('User not found')
    }
    // Return public user data
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  })

/**
 * Get user by email
 */
export const getUserByEmail = os
  .input(z.object({ email: z.string().email() }))
  .handler(async ({ input }) => {
    const user = Array.from(mockUsers.values()).find(u => u.email === input.email)
    if (!user) {
      return null
    }
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  })

/**
 * List users with pagination and filters
 */
export const listUsers = os
  .input(z.object({
    pagination: PaginationInputSchema.optional(),
    filters: UserFiltersSchema.optional(),
  }))
  .handler(async ({ input }) => {
    const { pagination = {}, filters = {} } = input
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = pagination

    let users = Array.from(mockUsers.values())

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase()
      users = users.filter(u => 
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        (u.username && u.username.toLowerCase().includes(search))
      )
    }
    if (filters.role) {
      users = users.filter(u => u.role === filters.role)
    }
    if (filters.status) {
      users = users.filter(u => u.status === filters.status)
    }
    if (filters.createdAfter) {
      users = users.filter(u => u.createdAt >= filters.createdAfter!)
    }
    if (filters.createdBefore) {
      users = users.filter(u => u.createdAt <= filters.createdBefore!)
    }

    // Sort
    users.sort((a, b) => {
      const aVal = a[sortBy as keyof User] as any
      const bVal = b[sortBy as keyof User] as any
      const order = sortOrder === 'asc' ? 1 : -1
      return aVal > bVal ? order : -order
    })

    // Paginate
    const total = users.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedUsers = users.slice(start, start + limit)

    // Convert to public users
    const publicUsers = paginatedUsers.map(u => ({
      id: u.id,
      name: u.name,
      username: u.username,
      avatar: u.avatar,
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }))

    return {
      data: publicUsers,
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    }
  })

/**
 * Create a new user
 */
export const createUser = os
  .input(CreateUserInputSchema)
  .handler(async ({ input }) => {
    // Check if email already exists
    const existingUser = Array.from(mockUsers.values()).find(u => u.email === input.email)
    if (existingUser) {
      throw new Error('Email already exists')
    }

    // Check if username already exists
    if (input.username) {
      const existingUsername = Array.from(mockUsers.values()).find(u => u.username === input.username)
      if (existingUsername) {
        throw new Error('Username already taken')
      }
    }

    // Create user (password would be hashed in real implementation)
    const user = createMockUser(input)
    return user
  })

/**
 * Update user information
 */
export const updateUser = os
  .input(z.object({
    id: z.string().uuid(),
    data: UpdateUserInputSchema,
  }))
  .handler(async ({ input }) => {
    const user = mockUsers.get(input.id)
    if (!user) {
      throw new Error('User not found')
    }

    // Check email uniqueness if changing
    if (input.data.email && input.data.email !== user.email) {
      const existingUser = Array.from(mockUsers.values()).find(u => u.email === input.data.email)
      if (existingUser) {
        throw new Error('Email already exists')
      }
    }

    // Check username uniqueness if changing
    if (input.data.username && input.data.username !== user.username) {
      const existingUsername = Array.from(mockUsers.values()).find(u => u.username === input.data.username)
      if (existingUsername) {
        throw new Error('Username already taken')
      }
    }

    // Update user
    const updatedUser: User = {
      ...user,
      ...input.data,
      updatedAt: new Date(),
    }
    mockUsers.set(input.id, updatedUser)
    return updatedUser
  })

/**
 * Delete a user
 */
export const deleteUser = os
  .input(IdParamSchema)
  .handler(async ({ input }) => {
    const user = mockUsers.get(String(input.id))
    if (!user) {
      throw new Error('User not found')
    }
    mockUsers.delete(String(input.id))
    return { success: true }
  })