// @ts-check

import { Utils } from "../../utils";

/**
 * @typedef {import('../domain/like.type').CreateLikeDTO} CreateLikeDTO
 * @typedef {import('../domain/like.type').ILikeService} ILikeService
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

export class LikeController {
  /**
   * @type {ILikeService}
   */
  likeService;
  utils = new Utils();

  /**
   *
   * @param {ILikeService} likeService
   */
  constructor(likeService) {
    this.likeService = likeService;
  }

  /**
   * Create a new like
   * @param {Request} req - Request
   * @param {Response} res - Response
   */
  async create(req, res) {
    try {
      const like = await this.likeService.create(req.body);
      res.status(201).json(this.utils.buildSuccessResponse("Like created", like));
    } catch (error) {
      res.status(400).json(this.utils.buildErrorResponse(error.message));
    }
  }

  /**
   * Find all likes by character id
   * @param {Request} req - Request
   * @param {Response} res - Response
   */
  async findAllByCharacterId(req, res) {
    const { characterId } = req.params;
    try {
      const likes = await this.likeService.findAllByCharacterId(+characterId);
      res.status(200).json(this.utils.buildSuccessResponse("Likes found", likes));
    } catch (error) {
      res.status(400).json(this.utils.buildErrorResponse(error.message));
    }
  }

  /**
   * Find all likes by user id
   * @param {Request} req - Request
   * @param {Response} res - Response
   */
  async findAllByUserId(req, res) {
    const { userId } = req.params;
    try {
      const likes = await this.likeService.findAllByUserId(userId);
      res.status(200).json(this.utils.buildSuccessResponse("Likes found", likes));
    } catch (error) {
      res.status(400).json(this.utils.buildErrorResponse(error.message));
    }
  }

  /**
   * Delete a like by id
   * @param {Request} req - Request
   * @param {Response} res - Response
   */
  async delete(req, res) {
    const { id } = req.params;
    try {
      const like = await this.likeService.delete(id);
      res.status(200).json(this.utils.buildSuccessResponse("Like deleted", like));
    } catch (error) {
      res.status(400).json(this.utils.buildErrorResponse(error.message));
    }
  }
}