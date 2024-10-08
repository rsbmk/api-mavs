// @ts-check

import { FailedlUser, UserAlreadyExists, UserDataRequired, UserNotFound } from "../domain/user.exeptions.js";

/**
 * @typedef {import('../domain/user.type.js').User} User
 * @typedef {import('../domain/user.type.js').UserWithoutPassword} UserWithoutPassword
 * @typedef {import('../domain/user.type.js').CreateUserDTO} CreateUserDTO
 * @typedef {import('../domain/user.type.js').IUserRespository} IUserRespository
 * @typedef {import('../domain/user.type.js').IUserService} IUserService
 * @typedef {import('../../libs/bcrypt/domain/bcrypt.type.js').IBcryptService} IBcryptService
 */

/**
 * @class UserService
 * @extends {IUserService}
 */
export class UserService {
  /**
   * User Repository
   * @type {IUserRespository}
   */
  userRepository;

  /**
   * @type {IBcryptService}
   */
  bcryptService;

  /**
   * Creates an instance of UserService.
   *
   * @param {IUserRespository} userRepository - User Repository
   * @param {IBcryptService} bcryptService - Bcrypt Service
   */
  constructor(userRepository, bcryptService) {
    this.userRepository = userRepository;
    this.bcryptService = bcryptService;
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
    let { username, name, password } = user;
    if (!username || !name || !password) throw new UserDataRequired();

    const [isUsernameExist] = await this.userRepository.findOneByUsername(username);
    if (isUsernameExist) throw new UserAlreadyExists(username);

    password = await this.hashPassword(password);

    const userCreated = await this.userRepository.save({ name, username, password }).catch(() => {
      // TODO: send this error to sentry
      throw new FailedlUser(username);
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
    if (!id) throw new UserDataRequired();

    const [user] = await this.userRepository.findById(id).catch(() => {
      // TODO: send this error to sentry
      throw new FailedlUser(id);
    });

    if (!user) throw new UserNotFound();
    return this.cleanPassword(user);
  }

  /**
   * Retrieves a user by their username.
   * @param {string} username - The username of the user to be retrieved.
   * @returns {Promise<UserWithoutPassword>} The user object if found, otherwise null.
   */
  async findOneByUsername(username) {
    if (!username) throw new UserDataRequired();

    const [user] = await this.userRepository.findOneByUsername(username).catch(() => {
      // TODO: send this error to sentry
      throw new FailedlUser(username);
    });

    if (!user) throw new UserNotFound();
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
    if (!id) throw new UserDataRequired();
    if (!(user?.name || user?.username || user?.characters)) throw new UserDataRequired();

    const updatedUser = await this.userRepository.update(id, user).catch(() => {
      // TODO: send this error to sentry
      throw new FailedlUser(id);
    });

    if (!updatedUser) throw new UserNotFound();
    return this.cleanPassword(updatedUser);
  }

  /**
   * Deletes a user by their unique identifier.
   *
   * @param {string} id - The unique identifier of the user to be deleted.
   * @return {Promise<UserWithoutPassword>} A promise that resolves when the deletion is complete.
   */
  async delete(id) {
    if (!id) throw new UserDataRequired();
    const user = await this.userRepository.delete(id).catch(() => {
      // TODO: send this error to sentry
      throw new FailedlUser(id);
    });

    if (!user) throw new UserNotFound();
    return this.cleanPassword(user);
  }

  /**
   * Clean password from user object
   * @param {User} user - the user object
   * @returns {UserWithoutPassword} the user object without the password
   */
  cleanPassword(user) {
    // @ts-ignore
    user.password = undefined;
    return user;
  }

  /**
   * Find user by username with password
   * @param {string} username - the username
   * @returns { Promise<User>} the user with the password
   */
  async findUserByUsernameWithPassword(username) {
    if (!username) throw new UserDataRequired();
    const [user] = await this.userRepository.findOneByUsername(username).catch(() => {
      // TODO: send this error to sentry
      throw new FailedlUser(username);
    });

    if (!user) throw new UserNotFound();
    return user;
  }

  /**
   * Hash password
   * @param {string} password - the password
   * @returns {Promise<string>} the hashed password
   */
  async hashPassword(password) {
    const salt = await this.bcryptService.genSalt(10);
    return this.bcryptService.hash(password, salt);
  }
}
