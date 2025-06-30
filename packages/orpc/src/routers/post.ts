import {
  getPost,
  listPosts,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  getPostStats,
} from '../procedures/post'

/**
 * Post router containing all post-related procedures
 */
export const postRouter = {
  get: getPost,
  list: listPosts,
  create: createPost,
  update: updatePost,
  delete: deletePost,
  publish: publishPost,
  stats: getPostStats,
}