import { z } from 'zod'

/**
 * User role enum
 */
export const UserRoleSchema = z.enum(['admin', 'user', 'moderator'])

/**
 * User status enum
 */
export const UserStatusSchema = z.enum(['active', 'inactive', 'suspended'])

/**
 * Complete user entity schema
 */
export const UserSchema = z.object({
  id: z.string().uuid().describe('Unique user identifier'),
  email: z.string().email().describe('User email address'),
  name: z.string().min(2).max(100).describe('User full name'),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/).optional().describe('Unique username'),
  avatar: z.string().url().optional().nullable().describe('User avatar URL'),
  role: UserRoleSchema.default('user').describe('User role'),
  status: UserStatusSchema.default('active').describe('Account status'),
  createdAt: z.date().or(z.string().transform((val) => new Date(val))).describe('Account creation date'),
  updatedAt: z.date().or(z.string().transform((val) => new Date(val))).describe('Last update date'),
})

/**
 * Schema for creating a new user
 */
export const CreateUserInputSchema = z.object({
  email: z.string().email().describe('Email address (must be unique)'),
  password: z.string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .describe('User password'),
  name: z.string().min(2).max(100).describe('Full name'),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/).optional().describe('Optional username'),
  avatar: z.string().url().optional().describe('Optional avatar URL'),
  role: UserRoleSchema.optional().describe('User role (defaults to "user")'),
})

/**
 * Schema for updating user information
 */
export const UpdateUserInputSchema = z.object({
  email: z.string().email().optional().describe('New email address'),
  name: z.string().min(2).max(100).optional().describe('New name'),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/).optional().describe('New username'),
  avatar: z.string().url().nullable().optional().describe('New avatar URL (null to remove)'),
  role: UserRoleSchema.optional().describe('New role (admin only)'),
  status: UserStatusSchema.optional().describe('New status (admin only)'),
})

/**
 * Schema for user filters
 */
export const UserFiltersSchema = z.object({
  search: z.string().optional().describe('Search by name, email, or username'),
  role: UserRoleSchema.optional().describe('Filter by role'),
  status: UserStatusSchema.optional().describe('Filter by status'),
  createdAfter: z.date().or(z.string().transform((val) => new Date(val))).optional().describe('Filter by creation date'),
  createdBefore: z.date().or(z.string().transform((val) => new Date(val))).optional().describe('Filter by creation date'),
})

/**
 * Schema for password change
 */
export const ChangePasswordInputSchema = z.object({
  currentPassword: z.string().describe('Current password for verification'),
  newPassword: z.string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .describe('New password'),
})

/**
 * Public user schema (excludes sensitive data)
 */
export const PublicUserSchema = UserSchema.omit({ 
  email: true,
  status: true 
}).extend({
  email: z.string().email().optional().describe('Email (only visible to self or admin)'),
})

// Export TypeScript types
export type User = z.infer<typeof UserSchema>
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>
export type UserFilters = z.infer<typeof UserFiltersSchema>
export type ChangePasswordInput = z.infer<typeof ChangePasswordInputSchema>
export type PublicUser = z.infer<typeof PublicUserSchema>
export type UserRole = z.infer<typeof UserRoleSchema>
export type UserStatus = z.infer<typeof UserStatusSchema>