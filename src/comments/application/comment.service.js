// @ts-check

import { CharacterIdRequired, CommentDataRequired, CommentIdRequired, CommentRequiered, TransactionFailed, UserIdRequired } from "../domain/comment.exeptions.js";

/**
 * @typedef {import('../domain/commnet.type.js').Comment} Comment
 * @typedef {import('../domain/commnet.type.js').CreateCommentDTO} CreateCommentDTO
 * @typedef {import('../domain/commnet.type.js').ICommentRespository} ICommentRepository
 * @typedef {import('../domain/commnet.type.js').ICommentService} ICommentService
 * @typedef {import('../../user/domain/user.type.js').IUserService} IUserService
 */

/**
 * @class CommentService
 * @implements {ICommentService}
 */
export class CommentService {
  /**
   * @type {ICommentRepository}
   */
  commentRepository;

  /**
   * Creates a new CommentService instance.
   * @param {ICommentRepository} commentRepository - The comment repository.
   */
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  /**
   * Creates a new comment.
   * @param {CreateCommentDTO} data - The comment object to be saved.
   * @param {string} userId - The id of the user.
   * @returns {Promise<Comment>} A promise that resolves to the saved comment.
   */
  create(userId, data) {
    if (!userId) throw new UserIdRequired();

    const { comment, characterId } = data;
    if (!(characterId && comment)) throw new CommentDataRequired();

    return this.commentRepository.create({ characterId, comment, userId }).catch(() => {
      throw new TransactionFailed();
    });
  }

  /**
   * Retrieves all comments for a character.
   * @param {number} characterId - The id of the character.
   * @returns {Promise<Comment[]>} A promise that resolves to an array of comments.
   */
  findAllByCharacterId(characterId) {
    if (!characterId) throw new CharacterIdRequired();
    return this.commentRepository.findAllByCharacterId(characterId).catch(() => {
      throw new TransactionFailed();
    });
  }

  /**
   * Retrieves all comments for a user.
   * @param {string} userId - The id of the user.
   * @returns {Promise<Comment[]>} A promise that resolves to an array of comments.
   */
  findAllByUserId(userId) {
    if (!userId) throw new UserIdRequired();
    return this.commentRepository.findAllByUserId(userId).catch(() => {
      throw new TransactionFailed();
    });
  }

  /**
   * Updates a comment in the database.
   * @param {string} id - The id of the comment.
   * @param {Partial<Comment>} data - The comment object to be updated.
   * @returns {Promise<Comment | null>} A promise that resolves to the updated comment or null if not found.
   */
  update(id, data) {
    if (!id) throw new CommentIdRequired();

    const { comment } = data;
    if (!comment) throw new CommentRequiered();

    return this.commentRepository.update(id, { comment, updateAt: new Date() }).catch(() => {
      throw new TransactionFailed();
    });
  }

  /**
   * Deletes a comment from the database.
   * @param {string} id - The id of the comment.
   * @returns {Promise<Comment | null>} A promise that resolves to the deleted comment.
   */
  delete(id) {
    if (!id) throw new CommentIdRequired();
    return this.commentRepository.update(id, { state: false, deleteAt: new Date() }).catch(() => {
      throw new TransactionFailed();
    });
  }
}
