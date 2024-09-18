// @ts-check

import { BEARER_LENGTH } from "../../common/constants.js";
import { Utils } from "../../common/utils.js";

/**
 * @typedef {import('../../libs/jwt/domain/jwt.type.js').IJWTService} IJWTService
 * @typedef {import('../../libs/jwt/domain/jwt.type.js').DecodeToken} DecodeToken
 * @typedef {import('../../libs/jwt/domain/jwt.type.js').TokenData} TokenData
 *
 * @typedef {import('express').Request & {userId: string}} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

export class JwtApiGuard {
  /**
   * @type {IJWTService}
   */
  jwtService;
  utils = new Utils();

  /**
   * Creates an instance of ApiGuard.
   * @param {IJWTService} jwtService - JWT service
   */
  constructor(jwtService) {
    this.jwtService = jwtService;
  }

  /**
   * Guard middleware to authorize a user
   * @param {Request} req - Request
   * @param {Response} res - Response
   * @param {NextFunction} next - NextFunction
   */
  run(req, res, next) {
    const authorization = req.get("authorization");
    if (!authorization) {
      return res.status(401).json(this.utils.buildErrorResponse("no authorization"));
    }

    const token = authorization.substring(BEARER_LENGTH);
    const decodeToken = this.jwtService.verify(token);
    req.userId = decodeToken.id;
    next();
  }
}
