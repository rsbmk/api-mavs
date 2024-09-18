// @ts-check

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { EXPIRATION_JWT, SECRET_JWT } from "../../common/constants.js";

/**
 * @typedef {import('../../user/domain/user.type.js').IUserService} IUserService
 * @typedef {import('../../user/domain/user.type.js').User} User
 * @typedef {import('../domain/login.type.js').Credentials} Credentials
 * @typedef {import('../domain/login.type.js').UserLogin} UserLogin
 * @typedef {import('../domain/login.type.js').IAuthService} IAuthService
 */

/**
 * @class AuthService
 * @implements {IAuthService}
 */
export class AuthService {
  /**
   * @type {IUserService}
   */
  userService;

  /**
   * Creates an instance of LoginService.
   * @param {IUserService} userService - User Service
   */
  constructor(userService) {
    this.userService = userService;
  }

  /**
   * Login user
   * @param {Credentials} credentials - the user crendentials
   * @returns {Promise<UserLogin>} The user loged
   *
   * @throws {Error} invalid user or password
   */
  async login(credentials) {
    const { username, password } = credentials;
    if (!username || !password) throw new Error("invalid user or password");

    const user = await this.userService.findUserByUsernameWithPassword(username);
    const isCorretPassword = await bcrypt.compare(password, user.password);
    if (!isCorretPassword) throw new Error("invalid user or password");

    const token = this.generateToken(user.id);
    return { token, username, id: user.id };
  }

  /**
   * Generate token
   * @param {string} userId - the user object
   * @returns {string} the token
   */
  generateToken(userId) {
    return jwt.sign({ id: userId }, SECRET_JWT, { expiresIn: EXPIRATION_JWT });
  }
}
