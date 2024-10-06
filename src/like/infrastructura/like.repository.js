// @ts-check

/**
 * @typedef {import('../domain/like.type').Like} Like
 * @typedef {import('../domain/like.type').CreateLikeDTO} CreateLikeDTO
 * @typedef {import('../domain/like.type').FindFilter} FindFilter
 * @typedef {import('../domain/like.type').ILikeModel} ILikeModel
 * @typedef {import('../domain/like.type').ILikeRepository} ILikeRepository
 */

/**
 * @class LikeRepository
 * @implements {ILikeRepository}
 */
export class LikeRepository {
  /**
   * @type {ILikeModel}
   */
  likeModel;

  /**
   * Create a new LikeRepository
   * @param {ILikeModel} likeModel - Like Model
   */
  constructor(likeModel) {
    this.likeModel = likeModel;
  }

  /**
   * Create a new like
   * @param {CreateLikeDTO} like - Like DTO
   * @returns {Promise<Like>} like created
   */
  create(like) {
    return this.likeModel.create(like);
  }

  /**
   * Find all likes
   * @param {FindFilter} filter - Like filter to find
   * @returns {Promise<Like[]>} Likes found
   */
  async find(filter) {
    const likes = await this.likeModel.find({ ...filter, state: true });
    return likes.map((like) => like.toObject());
  }

  /**
   * Update a like
   * @param {string} id - Like id to update
   * @param {Partial<Like>} like - Like DTO to update
   * @returns {Promise<Like | null>} Like updated
   */
  update(id, like) {
    return this.likeModel.findByIdAndUpdate(id, like, { new: true });
  }

  /**
   * Count the number of likes for a character
   * @param {number} characterId - The character id
   * @returns {Promise<number>} The number of likes
   */
  count(characterId) {
    return this.likeModel.countDocuments({ characterId, state: true });
  }
}
