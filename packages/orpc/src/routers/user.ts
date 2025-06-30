import {
  getUser,
  getUserByEmail,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../procedures/user'

/**
 * User router containing all user-related procedures
 */
export const userRouter = {
  get: getUser,
  getByEmail: getUserByEmail,
  list: listUsers,
  create: createUser,
  update: updateUser,
  delete: deleteUser,
}