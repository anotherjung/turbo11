import { z } from 'zod'

/**
 * Pagination input schema for list queries
 */
export const PaginationInputSchema = z.object({
  page: z.number().int().positive().default(1).describe('Page number (1-based)'),
  limit: z.number().int().positive().max(100).default(20).describe('Items per page'),
  sortBy: z.string().optional().describe('Field to sort by'),
  sortOrder: z.enum(['asc', 'desc']).default('desc').describe('Sort order'),
})

/**
 * Generic pagination output wrapper
 */
export const createPaginationOutputSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  })

/**
 * ID parameter schema (supports both string and number IDs)
 */
export const IdParamSchema = z.object({
  id: z.union([z.string().min(1), z.number().int().positive()]),
})

/**
 * Search query schema
 */
export const SearchQuerySchema = z.object({
  q: z.string().min(1).max(200).describe('Search query'),
  filters: z.record(z.string(), z.any()).optional().describe('Additional filters'),
})

/**
 * Error response schema
 */
export const ErrorResponseSchema = z.object({
  message: z.string().describe('Human-readable error message'),
  code: z.string().optional().describe('Error code for programmatic handling'),
  details: z.record(z.string(), z.any()).optional().describe('Additional error details'),
})

/**
 * Success response wrapper
 */
export const createSuccessResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
  })

/**
 * Date range filter schema
 */
export const DateRangeSchema = z.object({
  from: z.date().or(z.string().transform((val) => new Date(val))).optional(),
  to: z.date().or(z.string().transform((val) => new Date(val))).optional(),
})

// Export TypeScript types
export type PaginationInput = z.infer<typeof PaginationInputSchema>
export type IdParam = z.infer<typeof IdParamSchema>
export type SearchQuery = z.infer<typeof SearchQuerySchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
export type DateRange = z.infer<typeof DateRangeSchema>

// Type helper for pagination output
export type PaginationOutput<T> = {
  data: T[]
  total: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}