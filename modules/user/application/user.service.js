// @ts-check

import bcrypt from "bcrypt";

/**
 * @typedef {import('../domain/user.type.js').User} User
 * @typedef {import('../domain/user.type.js').CreateUserDTO} CreateUserDTO
 * @typedef {import('../domain/user.type.js').IUserRespository} IUserRespository
 */

export class UserService {
  /**
   * User Repository
   * @type {IUserRespository}
   */
  userRepository;

  /**
   * Creates an instance of UserService.
   *
   * @param {IUserRespository} userRepository - User Repository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Saves a new user to the database.
   *
   * @param {CreateUserDTO} user - The user object to be saved.
   * @return {Promise<User>} A promise that resolves with the saved user.
   *
   * @throws {Error} If any of the required fields are missing.
   * @throws {Error} If the username already exists.
   */
  async create(user) {
    const { username, name, password } = user;
    if (!username || !name || !password) {
      throw new Error("username, password and name are required");
    }

    const isUsernameExist = await this.userRepository.findOneByUsername(username);
    if (isUsernameExist) {
      throw new Error(`The username ${username} already exists`);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    return this.userRepository.save({ name, username, password: passwordHash }).catch(() => {
      // TODO: send this error to sentry
      throw new Error(`Error saving user: ${user.username}`);
    });
  }

  /**
   * Retrieves a user by their unique identifier.
   *
   * @param {string} id - The unique identifier of the user to be retrieved.
   * @return {Promise<User>} The user object if found, otherwise null.
   *
   * @throws {Error} If the user is not found.
   */
  async findOneById(id) {
    const user = await this.userRepository.findById(id).catch(() => {
      // TODO: send this error to sentry
      throw new Error(`Error finding user with id ${id}`);
    });

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    return user;
  }

  /**
   * Retrieves a user by their username.
   * @param {string} username - The username of the user to be retrieved.
   * @returns {Promise<User>} The user object if found, otherwise null.
   */
  async findOneByUsername(username) {
    const user = await this.userRepository.findOneByUsername(username).catch(() => {
      // TODO: send this error to sentry
      throw new Error(`Error finding user with username ${username}`);
    });

    if (!user) {
      throw new Error(`User with username ${username} not found`);
    }

    return user;
  }

  /**
   * Updates a user's name or username.
   *
   * @param {string} id - The unique identifier of the user to be updated.
   * @param {Partial<User>} user - The updated user object.
   * @return {Promise<User>} A promise that resolves when the update is complete.
   *
   * @throws {Error} If the user is not found.
   * @throws {Error} If any of the required fields are missing.
   */
  async update(id, user) {
    if (!id) throw new Error("id is required");

    if (!(user?.name || user?.username || user?.characters)) {
      throw new Error("name, username or characters are required");
    }

    return this.userRepository.update(id, user).catch(() => {
      // TODO: send this error to sentry
      throw new Error(`Error updating user with id ${id}`);
    });
  }

  /**
   * Deletes a user by their unique identifier.
   *
   * @param {string} id - The unique identifier of the user to be deleted.
   * @return {Promise<User>} A promise that resolves when the deletion is complete.
   */
  async delete(id) {
    return this.userRepository.delete(id).catch(() => {
      // TODO: send this error to sentry
      throw new Error(`Error deleting user with id ${id}`);
    });
  }
}
