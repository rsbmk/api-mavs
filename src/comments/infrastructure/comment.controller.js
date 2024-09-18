// @ts-check

import { Utils } from "../../common/utils.js";

/**
 * @typedef {import('../domain/commnet.type.js').Comment} Comment
 * @typedef {import('../domain/commnet.type.js').CreateCommentDTO} CreateCommentDTO
 * @typedef {import('../domain/commnet.type.js').ICommentService} ICommentService
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

/**
 * @class CommentController
 */
export class CommentController {
  /**
   * @type {ICommentService}
   */
  commentService;
  utils = new Utils();

  /**
   * Creates an instance of CommentController.
   * @param {ICommentService} commentService - Comment Service
   */
  constructor(commentService) {
    this.commentService = commentService;
  }

  /**
   * Creates a new comment.
   * @param {Request & { userId: string }} req - Request
   * @param {Response} res - Response
   */
  async create(req, res) {
    const { userId } = req;
    try {
      const comment = await this.commentService.create(userId, req.body);
      res.status(201).json(this.utils.buildSuccessResponse("comment created", comment));
    } catch (error) {
      res.status(400).json(this.utils.buildErrorResponse(error.message));
    }
  }

  /**
   * Retrieves all comments for a character.
   * @param {Request} req - Request
   * @param {Response} res - Response
   */
  async findAllByCharacterId(req, res) {
    const { characterId } = req.params;
    try {
      const comments = await this.commentService.findAllByCharacterId(+characterId);
      res.status(200).json(this.utils.buildSuccessResponse("comments found", comments));
    } catch (error) {
      res.status(404).json(this.utils.buildErrorResponse(error.message));
    }
  }

  /**
   * Retrieves all comments for a user.
   * @param {Request} req - Request
   * @param {Response} res - Response
   */
  async findAllByUserId(req, res) {
    const { userId } = req.params;
    try {
      const comments = await this.commentService.findAllByUserId(userId);
      res.status(200).json(this.utils.buildSuccessResponse("comments found", comments));
    } catch (error) {
      res.status(404).json(this.utils.buildErrorResponse(error.message));
    }
  }

  /**p
   * Updates a comment
   * @param {Request} req - Request
   * @param {Response} res - Response
   */
  async update(req, res) {
    const { id } = req.params;
    try {
      const comment = await this.commentService.update(id, req.body);
      res.status(200).json(this.utils.buildSuccessResponse("comment updated", comment));
    } catch (error) {
      res.status(404).json(this.utils.buildErrorResponse(error.message));
    }
  }

  /**
   * Deletes a comment
   * @param {Request} req - Request
   * @param {Response} res - Response
   */
  async delete(req, res) {
    const { id } = req.params;
    try {
      const comment = await this.commentService.delete(id);
      res.status(200).json(this.utils.buildSuccessResponse("comment deleted", comment));
    } catch (error) {
      res.status(404).json(this.utils.buildErrorResponse(error.message));
    }
  }
}
