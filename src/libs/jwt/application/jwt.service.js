// @ts-check

/**
 * @typedef {import('../domain/jwt.type.js').IJWTService} IJWTService
 * @typedef {import('../domain/jwt.type.js').JWT} JWT
 * @typedef {import('../domain/jwt.type.js').TokenData} TokenData
 * @typedef {import('../domain/jwt.type.js').DecodeToken} DecodeToken
 */

import { EXPIRATION_JWT, SECRET_JWT } from "../../../common/constants.js";
import { TokenDataRequired, TokenRequired } from "../domain/jwt.exeptions.js";

/**
 * @class JwtService
 * @implements {IJWTService}
 */
export class JwtService {
  /**
   * @type {JWT}
   */
  jwt;

  /**
   * Creates an instance of JwtService.
   * @param {JWT} jwt - JWT
   */
  constructor(jwt) {
    this.jwt = jwt;
  }

  /**
   * Sign token
   * @param {string} token - the token
   * @returns {DecodeToken} the token
   */
  verify(token) {
    if (!token) throw new TokenRequired();
    return this.jwt.verify(token, SECRET_JWT);
  }

  /**
   * Sign token
   * @param {TokenData} token - the token
   * @returns {string} the token
   */
  sign(token) {
    if (!token) throw new TokenRequired();
    if (!token.id) throw new TokenDataRequired();
    return this.jwt.sign(token, SECRET_JWT, { expiresIn: EXPIRATION_JWT });
  }
}
