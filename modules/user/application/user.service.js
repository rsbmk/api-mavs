// @ts-check

import bcrypt from "bcrypt";

/**
 * @typedef {import('../domain/user.type.js').User} User
 * @typedef {import('../domain/user.type.js').UserWithoutPassword} UserWithoutPassword
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
   * @return {Promise<UserWithoutPassword>} A promise that resolves with the saved user.
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

    const userCreated = await this.userRepository.save({ name, username, password: passwordHash }).catch(() => {
      // TODO: send this error to sentry
      throw new Error(`Error saving user: ${user.username}`);
    });

    return this.cleanPassword(userCreated);
  }

  /**
   * Retrieves a user by their unique identifier.
   *
   * @param {string} id - The unique identifier of the user to be retrieved.
   * @return {Promise<UserWithoutPassword>} The user object if found, otherwise null.
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

    return this.cleanPassword(user);
  }

  /**
   * Retrieves a user by their username.
   * @param {string} username - The username of the user to be retrieved.
   * @returns {Promise<UserWithoutPassword>} The user object if found, otherwise null.
   */
  async findOneByUsername(username) {
    const user = await this.userRepository.findOneByUsername(username).catch(() => {
      // TODO: send this error to sentry
      throw new Error(`Error finding user with username ${username}`);
    });

    if (!user) {
      throw new Error(`User with username ${username} not found`);
    }

    return this.cleanPassword(user);
  }

  /**
   * Updates a user's name or username.
   *
   * @param {string} id - The unique identifier of the user to be updated.
   * @param {Partial<User>} user - The updated user object.
   * @return {Promise<UserWithoutPassword>} A promise that resolves when the update is complete.
   *
   * @throws {Error} If the user is not found.
   * @throws {Error} If any of the required fields are missing.
   */
  async update(id, user) {
    if (!id) throw new Error("id is required");

    if (!(user?.name || user?.username || user?.characters)) {
      throw new Error("name, username or characters are required");
    }

    const updatedUser = await this.userRepository.update(id, user).catch(() => {
      // TODO: send this error to sentry
      throw new Error(`Error updating user with id ${id}`);
    });

    return this.cleanPassword(updatedUser);
  }

  /**
   * Deletes a user by their unique identifier.
   *
   * @param {string} id - The unique identifier of the user to be deleted.
   * @return {Promise<UserWithoutPassword>} A promise that resolves when the deletion is complete.
   */
  async delete(id) {
    const user = await this.userRepository.delete(id).catch(() => {
      // TODO: send this error to sentry
      throw new Error(`Error deleting user with id ${id}`);
    });

    return this.cleanPassword(user);
  }

  /**
   * Clean password from user object
   * @param {User} user - the user object
   * @returns {UserWithoutPassword} the user object without the password
   */
  cleanPassword(user) {
    const { password, ...rest } = user;
    return rest;
  }

  /**
   * Find user by username with password
   * @param {string} username - the username
   * @returns { Promise<User>} the user with the password
   */
  async findUserByUsernameWithPassword(username) {
    const user = await this.userRepository.findOneByUsername(username).catch(() => {
      // TODO: send this error to sentry
      throw new Error(`Error finding user with username ${username}`);
    });

    if (!user) {
      throw new Error(`User with username ${username} not found`);
    }

    return user;
  }
}
