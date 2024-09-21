// @ts-check

import bcrypt from "bcrypt";

import { CredentialsRequired, InvalidCredentials } from "../domain/auth.exeptions.js";

/**
 * @typedef {import('../../user/domain/user.type.js').IUserService} IUserService
 * @typedef {import('../../user/domain/user.type.js').User} User
 * @typedef {import('../domain/login.type.js').Credentials} Credentials
 * @typedef {import('../domain/login.type.js').UserLogin} UserLogin
 * @typedef {import('../domain/login.type.js').IAuthService} IAuthService
 * @typedef {import('../../libs/jwt/domain/jwt.type.js').IJWTService} IJWTService
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
   * @type {IJWTService}
   */
  JWTService;

  /**
   * Creates an instance of LoginService.
   * @param {IUserService} userService - User Service
   * @param {IJWTService} JWTService - JWT Service
   */
  constructor(userService, JWTService) {
    this.userService = userService;
    this.JWTService = JWTService;
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
    if (!username || !password) throw new CredentialsRequired();

    const user = await this.userService.findUserByUsernameWithPassword(username);
    const isCorretPassword = await bcrypt.compare(password, user.password);
    if (!isCorretPassword) throw new InvalidCredentials();

    const token = this.generateToken(user.id);
    return { token, username, id: user.id };
  }

  /**
   * Generate token
   * @param {string} userId - the user object
   * @returns {string} the token
   */
  generateToken(userId) {
    return this.JWTService.sign({ id: userId });
  }
}
