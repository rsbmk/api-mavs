// @ts-check

import { Utils } from "../../common/utils.js";

/**
 * @typedef {import('../domain/user.type').IUserService} IUserService
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

export class UserController {
  /**
   * @type {IUserService}
   */
  userService;
  utils = new Utils();

  /**
   * Creates an instance of UserController.
   * @param {IUserService} userService - User Service
   */
  constructor(userService) {
    this.userService = userService;
  }

  /**
   * Create new user route
   * @param {Request} req - Request
   * @param {Response} res - Response
   */
  async create(req, res) {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json(this.utils.buildSuccessResponse("user created", user));
    } catch (error) {
      res.status(400).json(this.utils.buildErrorResponse(error.message));
    }
  }

  /**
   * Get user route
   * @param {Request} req - Request
   * @param {Response} res  - Response
   */
  async findOneById(req, res) {
    const { id } = req.params;
    try {
      const user = await this.userService.findOneById(id);
      res.status(200).json(this.utils.buildSuccessResponse("user found", user));
    } catch (error) {
      res.status(404).json(this.utils.buildErrorResponse(error.message));
    }
  }

  /**
   * Get user route
   * @param {Request} req - Request
   * @param {Response} res  - Response
   */
  async findOneByUsername(req, res) {
    const { username } = req.params;
    try {
      const user = await this.userService.findOneByUsername(username);
      res.status(200).json(this.utils.buildSuccessResponse("user found", user));
    } catch (error) {
      res.status(404).json(this.utils.buildErrorResponse(error.message));
    }
  }

  /**
   * Update user route
   * @param {Request} req - Request
   * @param {Response} res  - Response
   */
  async update(req, res) {
    const { id } = req.params;
    const user = req.body;
    try {
      const userUpdated = await this.userService.update(id, user);
      res.status(200).json(this.utils.buildSuccessResponse("user updated", userUpdated));
    } catch (error) {
      res.status(404).json(this.utils.buildErrorResponse(error.message));
    }
  }

  /**
   * Delete user route
   * @param {Request} req - Request
   * @param {Response} res  - Response
   */
  async delete(req, res) {
    const { id } = req.params;
    try {
      const user = await this.userService.delete(id);
      res.status(200).json(this.utils.buildSuccessResponse("user deleted", user));
    } catch (error) {
      res.status(404).json(this.utils.buildErrorResponse(error.message));
    }
  }
}
