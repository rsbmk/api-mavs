// @ts-check

import { Utils } from "../../utils/utils.js";

/**
 * @typedef {import('../domain/login.type.js').IAuthService} IAuthService
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

export class AuthController {
  /**
   * @type {IAuthService}
   */
  authService;
  utils = new Utils();

  /**
   * @param {IAuthService} authService - Authentication service
   */
  constructor(authService) {
    this.authService = authService;
  }

  /**
   * @param {Request} req
   * @param {Response} res
   */
  async login(req, res) {
    try {
      const user = await this.authService.login(req.body);
      res.status(200).json(this.utils.buildSuccessResponse("user loged", user));
    } catch (error) {
      res.status(400).json(this.utils.buildErrorResponse(error.message));
    }
  }
}
