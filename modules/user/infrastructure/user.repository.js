// @ts-check

/**
 * @typedef {import('../domain/user.type.js').User} User
 * @typedef {import('../domain/user.type.js').CreateUserDTO} CreateUserDTO
 * @typedef {import('../domain/user.type.js').IUserModel} IUserModel
 */

export class UserRepository {
  /**
   * @type {IUserModel}
   */
  userModel;

  /**
   * Creates a new UserRespository instance.
   * @param {IUserModel} userModel - The user model to use.
   */
  constructor(userModel) {
    this.userModel = userModel;
  }

  /**
   * Saves a new user to the database.
   *
   * @param {Partial<CreateUserDTO>} user - The user object to be saved.
   * @return {Promise<User>} A promise that resolves to the saved user.
   */
  save(user) {
    return this.userModel.create(user);
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param {string} id - The ID of the user to find.
   * @return {Promise<User | null>} The user with the matching ID, or null if not found.
   */
  findById(id) {
    return this.userModel.findOne({ _id: id, state: true });
  }

  /**
   * Retrieves a user by their username.
   *
   * @param {string} username - The username of the user to find.
   * @return {Promise<User | null>} The user with the matching username, or null if not found.
   */
  findOneByUsername(username) {
    return this.userModel.findOne({ username, state: true });
  }

  /**
   * Updates a user's name or username in the database.
   *
   * @param {string} id - The ID of the user to update.
   * @param {Partial<User>} user - The updated user object.
   * @return {Promise<User | null>} The updated user object.
   */
  update(id, user) {
    return this.userModel.findByIdAndUpdate(id, { ...user, updateAt: new Date() }, { new: true });
  }

  /**
   * Deletes a user from the database by their ID.
   *
   * @param {string} id - The ID of the user to delete.
   * @return {Promise<User>} The deleted user object.
   */
  delete(id) {
    return this.userModel.findByIdAndUpdate(id, { state: false, deleteAt: new Date() }, { new: true });
  }
}
