import { z } from 'zod'
import { os } from '@orpc/server'
import {
  PostSchema,
  CreatePostInputSchema,
  UpdatePostInputSchema,
  PostFiltersSchema,
  PublicPostSchema,
  PostStatsSchema,
  type Post,
  type CreatePostInput,
  type UpdatePostInput,
} from '../schemas/post'
import {
  PaginationInputSchema,
  IdParamSchema,
  createPaginationOutputSchema,
} from '../schemas/common'

// Mock post data store (replace with real database later)
const mockPosts: Map<string, Post> = new Map()

// Helper to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Helper to create mock post
const createMockPost = (input: CreatePostInput & { authorId: string }): Post => {
  const now = new Date()
  const post: Post = {
    id: crypto.randomUUID(),
    title: input.title,
    slug: input.slug || generateSlug(input.title),
    content: input.content,
    excerpt: input.excerpt || input.content.substring(0, 200) + '...',
    authorId: input.authorId,
    status: input.status || 'draft',
    category: input.category || 'other',
    tags: input.tags || [],
    featuredImage: input.featuredImage || null,
    published: input.published || false,
    publishedAt: input.published ? now : null,
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
  }
  mockPosts.set(post.id, post)
  return post
}

// Initialize with some mock data
if (mockPosts.size === 0) {
  createMockPost({
    title: 'Getting Started with ORPC',
    content: 'ORPC is a powerful RPC framework for TypeScript...',
    excerpt: 'Learn how to get started with ORPC',
    authorId: crypto.randomUUID(),
    category: 'technology',
    tags: ['orpc', 'typescript', 'rpc'],
    published: true,
  })
  createMockPost({
    title: 'Building Type-Safe APIs',
    content: 'Type safety is crucial for modern web development...',
    authorId: crypto.randomUUID(),
    category: 'technology',
    tags: ['typescript', 'api', 'type-safety'],
    status: 'draft',
  })
}

/**
 * Get post by ID
 */
export const getPost = os
  .input(IdParamSchema)
  .handler(async ({ input }) => {
    const post = mockPosts.get(String(input.id))
    if (!post) {
      throw new Error('Post not found')
    }

    // Increment view count
    post.viewCount += 1
    mockPosts.set(post.id, post)

    // Return public post data
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      authorId: post.authorId,
      category: post.category,
      tags: post.tags,
      featuredImage: post.featuredImage,
      published: post.published,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      // Mock author data
      author: {
        id: post.authorId,
        name: 'John Doe',
        avatar: null,
      },
    }
  })

/**
 * List posts with pagination and filters
 */
export const listPosts = os
  .input(z.object({
    pagination: PaginationInputSchema.optional(),
    filters: PostFiltersSchema.optional(),
  }))
  .handler(async ({ input }) => {
    const { pagination = {}, filters = {} } = input
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = pagination

    let posts = Array.from(mockPosts.values())

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase()
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.content.toLowerCase().includes(search) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(search))
      )
    }
    if (filters.authorId) {
      posts = posts.filter(p => p.authorId === filters.authorId)
    }
    if (filters.status) {
      posts = posts.filter(p => p.status === filters.status)
    }
    if (filters.category) {
      posts = posts.filter(p => p.category === filters.category)
    }
    if (filters.tags && filters.tags.length > 0) {
      posts = posts.filter(p => 
        filters.tags!.some(tag => p.tags.includes(tag))
      )
    }
    if (filters.published !== undefined) {
      posts = posts.filter(p => p.published === filters.published)
    }
    if (filters.publishedAfter) {
      posts = posts.filter(p => p.publishedAt && p.publishedAt >= filters.publishedAfter!)
    }
    if (filters.publishedBefore) {
      posts = posts.filter(p => p.publishedAt && p.publishedAt <= filters.publishedBefore!)
    }

    // Sort
    posts.sort((a, b) => {
      const aVal = a[sortBy as keyof Post] as any
      const bVal = b[sortBy as keyof Post] as any
      const order = sortOrder === 'asc' ? 1 : -1
      return aVal > bVal ? order : -order
    })

    // Paginate
    const total = posts.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedPosts = posts.slice(start, start + limit)

    // Convert to public posts
    const publicPosts = paginatedPosts.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      content: p.content,
      excerpt: p.excerpt,
      authorId: p.authorId,
      category: p.category,
      tags: p.tags,
      featuredImage: p.featuredImage,
      published: p.published,
      publishedAt: p.publishedAt,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      // Mock author data
      author: {
        id: p.authorId,
        name: 'John Doe',
        avatar: null,
      },
    }))

    return {
      data: publicPosts,
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    }
  })

/**
 * Create a new post
 */
export const createPost = os
  .input(CreatePostInputSchema)
  .handler(async ({ input }) => {
    // Check if slug already exists
    if (input.slug) {
      const existingPost = Array.from(mockPosts.values()).find(p => p.slug === input.slug)
      if (existingPost) {
        throw new Error('Slug already exists')
      }
    }

    // Create post (authorId would come from auth context in real implementation)
    const post = createMockPost({
      ...input,
      authorId: crypto.randomUUID(), // Mock author ID
    })
    return post
  })

/**
 * Update post information
 */
export const updatePost = os
  .input(z.object({
    id: z.string().uuid(),
    data: UpdatePostInputSchema,
  }))
  .handler(async ({ input }) => {
    const post = mockPosts.get(input.id)
    if (!post) {
      throw new Error('Post not found')
    }

    // Check slug uniqueness if changing
    if (input.data.slug && input.data.slug !== post.slug) {
      const existingPost = Array.from(mockPosts.values()).find(p => p.slug === input.data.slug)
      if (existingPost) {
        throw new Error('Slug already exists')
      }
    }

    // Update post
    const now = new Date()
    const updatedPost: Post = {
      ...post,
      ...input.data,
      updatedAt: now,
      // Update publishedAt if publishing
      publishedAt: input.data.published && !post.published ? now : post.publishedAt,
    }
    mockPosts.set(input.id, updatedPost)
    return updatedPost
  })

/**
 * Delete a post
 */
export const deletePost = os
  .input(IdParamSchema)
  .handler(async ({ input }) => {
    const post = mockPosts.get(String(input.id))
    if (!post) {
      throw new Error('Post not found')
    }
    mockPosts.delete(String(input.id))
    return { success: true }
  })

/**
 * Toggle post published status
 */
export const publishPost = os
  .input(z.object({
    id: z.string().uuid(),
    published: z.boolean(),
  }))
  .handler(async ({ input }) => {
    const post = mockPosts.get(input.id)
    if (!post) {
      throw new Error('Post not found')
    }

    const now = new Date()
    const updatedPost: Post = {
      ...post,
      published: input.published,
      publishedAt: input.published ? (post.publishedAt || now) : post.publishedAt,
      status: input.published ? 'published' : 'draft',
      updatedAt: now,
    }
    mockPosts.set(input.id, updatedPost)
    return updatedPost
  })

/**
 * Get post statistics
 */
export const getPostStats = os
  .input(z.object({
    authorId: z.string().uuid().optional(),
  }))
  .handler(async ({ input }) => {
    let posts = Array.from(mockPosts.values())
    
    if (input.authorId) {
      posts = posts.filter(p => p.authorId === input.authorId)
    }

    const totalPosts = posts.length
    const publishedPosts = posts.filter(p => p.published).length
    const draftPosts = posts.filter(p => p.status === 'draft').length
    const totalViews = posts.reduce((sum, p) => sum + p.viewCount, 0)
    const averageViewsPerPost = totalPosts > 0 ? totalViews / totalPosts : 0

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      averageViewsPerPost,
    }
  })