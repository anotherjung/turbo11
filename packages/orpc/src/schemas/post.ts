import { z } from 'zod'

/**
 * Post status enum
 */
export const PostStatusSchema = z.enum(['draft', 'published', 'archived'])

/**
 * Post category enum
 */
export const PostCategorySchema = z.enum([
  'technology',
  'business',
  'health',
  'science',
  'entertainment',
  'sports',
  'politics',
  'other'
])

/**
 * Complete post entity schema
 */
export const PostSchema = z.object({
  id: z.string().uuid().describe('Unique post identifier'),
  title: z.string().min(3).max(200).describe('Post title'),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/).describe('URL-friendly slug'),
  content: z.string().min(10).describe('Post content (HTML or Markdown)'),
  excerpt: z.string().max(500).optional().nullable().describe('Short excerpt or summary'),
  authorId: z.string().uuid().describe('ID of the post author'),
  status: PostStatusSchema.default('draft').describe('Publication status'),
  category: PostCategorySchema.default('other').describe('Post category'),
  tags: z.array(z.string().min(1).max(50)).default([]).describe('Post tags'),
  featuredImage: z.string().url().optional().nullable().describe('Featured image URL'),
  published: z.boolean().default(false).describe('Whether the post is published'),
  publishedAt: z.date().or(z.string().transform((val) => new Date(val))).optional().nullable().describe('Publication date'),
  viewCount: z.number().int().nonnegative().default(0).describe('Number of views'),
  createdAt: z.date().or(z.string().transform((val) => new Date(val))).describe('Creation date'),
  updatedAt: z.date().or(z.string().transform((val) => new Date(val))).describe('Last update date'),
})

/**
 * Schema for creating a new post
 */
export const CreatePostInputSchema = z.object({
  title: z.string().min(3).max(200).describe('Post title'),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/).optional().describe('Custom slug (auto-generated if not provided)'),
  content: z.string().min(10).describe('Post content'),
  excerpt: z.string().max(500).optional().describe('Optional excerpt'),
  category: PostCategorySchema.optional().describe('Post category'),
  tags: z.array(z.string().min(1).max(50)).optional().describe('Post tags'),
  featuredImage: z.string().url().optional().describe('Featured image URL'),
  status: PostStatusSchema.optional().describe('Initial status (defaults to "draft")'),
  published: z.boolean().optional().describe('Publish immediately'),
})

/**
 * Schema for updating a post
 */
export const UpdatePostInputSchema = z.object({
  title: z.string().min(3).max(200).optional().describe('New title'),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/).optional().describe('New slug'),
  content: z.string().min(10).optional().describe('New content'),
  excerpt: z.string().max(500).nullable().optional().describe('New excerpt'),
  category: PostCategorySchema.optional().describe('New category'),
  tags: z.array(z.string().min(1).max(50)).optional().describe('New tags'),
  featuredImage: z.string().url().nullable().optional().describe('New featured image'),
  status: PostStatusSchema.optional().describe('New status'),
  published: z.boolean().optional().describe('Publish/unpublish'),
})

/**
 * Schema for post filters
 */
export const PostFiltersSchema = z.object({
  search: z.string().optional().describe('Search in title, content, or excerpt'),
  authorId: z.string().uuid().optional().describe('Filter by author'),
  status: PostStatusSchema.optional().describe('Filter by status'),
  category: PostCategorySchema.optional().describe('Filter by category'),
  tags: z.array(z.string()).optional().describe('Filter by tags (any match)'),
  published: z.boolean().optional().describe('Filter by published state'),
  publishedAfter: z.date().or(z.string().transform((val) => new Date(val))).optional().describe('Published after date'),
  publishedBefore: z.date().or(z.string().transform((val) => new Date(val))).optional().describe('Published before date'),
})

/**
 * Public post schema (for readers)
 */
export const PublicPostSchema = PostSchema.omit({
  status: true,
  viewCount: true,
}).extend({
  author: z.object({
    id: z.string().uuid(),
    name: z.string(),
    avatar: z.string().url().optional().nullable(),
  }).optional().describe('Author information'),
})

/**
 * Post statistics schema
 */
export const PostStatsSchema = z.object({
  totalPosts: z.number().int().nonnegative(),
  publishedPosts: z.number().int().nonnegative(),
  draftPosts: z.number().int().nonnegative(),
  totalViews: z.number().int().nonnegative(),
  averageViewsPerPost: z.number().nonnegative(),
})

// Export TypeScript types
export type Post = z.infer<typeof PostSchema>
export type CreatePostInput = z.infer<typeof CreatePostInputSchema>
export type UpdatePostInput = z.infer<typeof UpdatePostInputSchema>
export type PostFilters = z.infer<typeof PostFiltersSchema>
export type PublicPost = z.infer<typeof PublicPostSchema>
export type PostStats = z.infer<typeof PostStatsSchema>
export type PostStatus = z.infer<typeof PostStatusSchema>
export type PostCategory = z.infer<typeof PostCategorySchema>