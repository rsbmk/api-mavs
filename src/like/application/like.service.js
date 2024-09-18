// @ts-check

/**
 * @typedef {import('../domain/like.type').CreateLikeDTO} CreateLikeDTO
 * @typedef {import('../domain/like.type').FindFilter} FindFilter
 * @typedef {import('../domain/like.type').ILikeRepository} ILikeRepository
 * @typedef {import('../domain/like.type').ILikeService} ILikeService
 * @typedef {import('../domain/like.type').Like} Like
 */

/**
 * @class LikeService
 * @implements {ILikeService}
 */
export class LikeService {
  /**
   * @type {ILikeRepository}
   */
  userRepository;

  /**
   * Create a new LikeService
   * @param {ILikeRepository} userRepository - User Repository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Create a new like
   * @param {CreateLikeDTO} like - Like DTO to create
   * @returns {Promise<Like>} Like created
   *
   * @throws {Error} if characterId or userId are not provided
   * @throws {Error} if like already exists
   */
  async create(like) {
    const { characterId, userId } = like;
    if (!characterId || !userId) throw new Error("characterId and userId are required");

    const likeExist = await this.userRepository.find({ characterId, userId });
    if (likeExist.length) throw new Error("Like already exists");

    return this.userRepository.create(like).catch(() => {
      // TODO: send error to sentry
      throw new Error(`Error creating like, for characterId: ${characterId} and userId: ${userId}`);
    });
  }

  /**
   * Find all likes by character id
   * @param {number} characterId - Character id to find likes
   * @returns {Promise<Like[]>} Array of likes
   *
   * @throws {Error} if characterId is not provided
   */
  findAllByCharacterId(characterId) {
    if (!characterId) throw new Error("characterId is required");
    return this.userRepository.find({ characterId }).catch(() => {
      // TODO: send error to sentry
      throw new Error(`Error finding likes, for characterId: ${characterId}`);
    });
  }

  /**
   * Find all likes by user id
   * @param {string} userId - User id to find likes
   * @returns {Promise<Like[]>} Array of likes
   *
   * @throws {Error} if userId is not provided
   */
  findAllByUserId(userId) {
    if (!userId) throw new Error("userId is required");
    return this.userRepository.find({ userId }).catch(() => {
      // TODO: send error to sentry
      throw new Error(`Error finding likes, for userId: ${userId}`);
    });
  }

  /**
   * Delete a like by id
   * @param {string} id - Like id to delete
   * @returns {Promise<Like | null>} Like deleted
   */
  delete(id) {
    if (!id) throw new Error("id is required");
    return this.userRepository.update(id, { state: false, deleteAt: new Date() }).catch(() => {
      // TODO: send error to sentry
      throw new Error(`Error deleting like, for id: ${id}`);
    });
  }
}
