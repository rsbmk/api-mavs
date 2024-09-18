// @ts-check

/**
 * @typedef {import('../domain/commnet.type.js').Comment} IComment
 * @typedef {import('../domain/commnet.type.js').CreateCommentDTO} CreateCommentDTO
 * @typedef {import('../domain/commnet.type.js').ICommentModel} ICommentModel
 * @typedef {import('../domain/commnet.type.js').ICommentRespository} ICommentRespository
 */

/**
 * @class CommentRepository
 * @implements {ICommentRespository}
 */
export class CommentRepository {
  /**
   * @type {ICommentModel}
   */
  commentModel;

  /**
   * Creates a new CommentRespository instance.
   * @param {ICommentModel} commentModel - The comment model to use.
   */
  constructor(commentModel) {
    this.commentModel = commentModel;
  }

  /**
   * Saves a new comment to the database.
   * @param {CreateCommentDTO} comment - The comment object to be saved.
   * @returns {Promise<IComment>} A promise that resolves to the saved comment.
   */
  create(comment) {
    return this.commentModel.create(comment);
  }

  /**
   * Retrieves all comments for a character.
   * @param {number} characterId - The id of the character.
   * @returns {Promise<IComment[]>} A promise that resolves to an array of comments.
   */
  findAllByCharacterId(characterId) {
    return this.commentModel.find({ characterId, state: true });
  }

  /**
   * Retrieves all comments for a user.
   * @param {string} userId - The id of the user.
   * @returns {Promise<IComment[]>} A promise that resolves to an array of comments.
   */
  findAllByUserId(userId) {
    return this.commentModel.find({ userId, state: true });
  }

  /**
   * Updates a comment in the database.
   * @param {string} id - The id of the comment.
   * @param {Partial<IComment>} comment - The comment object to be updated.
   * @returns {Promise<IComment | null>} A promise that resolves to the updated comment or null if not found.
   */
  update(id, comment) {
    return this.commentModel.findByIdAndUpdate(id, comment, { new: true });
  }
}
