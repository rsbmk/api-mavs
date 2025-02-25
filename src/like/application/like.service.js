// @ts-check

import { CreateLikeFailed, DeleteLikeFailed, FindLikeFailed, LikeDataRequiered, LikeIdRequired, LikeNotFound } from "../domain/like.exeptions.js";

/**
 * @typedef {import('../domain/like.type.js').CreateLikeDTO} CreateLikeDTO
 * @typedef {import('../domain/like.type.js').FindFilter} FindFilter
 * @typedef {import('../domain/like.type.js').ILikeRepository} ILikeRepository
 * @typedef {import('../domain/like.type.js').ILikeService} ILikeService
 * @typedef {import('../domain/like.type.js').Like} Like
 * @typedef {import("../domain/like.type.js").UserLike} UserLike
 */

/**
 * @class LikeService
 * @implements {ILikeService}
 */
export class LikeService {
  /**
   * @type {ILikeRepository}
   */
  likeRepository;

  /**
   * Create a new LikeService
   * @param {ILikeRepository} likeRepository - Like Repository
   */
  constructor(likeRepository) {
    this.likeRepository = likeRepository;
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
    if (!characterId || !userId) throw new LikeDataRequiered();

    const likeExist = await this.likeRepository.find({ characterId, userId });
    if (likeExist.length) return likeExist[0];

    return this.likeRepository.create(like).catch(() => {
      // TODO: send error to sentry
      throw new CreateLikeFailed(characterId, userId);
    });
  }

  /**
   * Find the numbers of like that a character has
   * @param {number} characterId - The character id
   * @param {string} userId - The user id
   * @returns {Promise<Like>} The number of likes
   *
   * @throws {Error} if characterId or userId are not provided
   */
  async findByCharacterAndUserId(characterId, userId) {
    if (!characterId) throw new LikeDataRequiered();
    const [likes, characterLike] = await Promise.all([
      this.likeRepository.count(characterId),
      this.likeRepository.find({ characterId, userId }),
    ]).catch(() => {
      // TODO: send error to sentry
      throw new FindLikeFailed("characterId", characterId);
    });

    return Object.assign({}, characterLike[0], { total: likes });
  }
  /**
   * Find all likes by user id
   * @param {string} userId - User id to find likes
   * @returns {Promise<UserLike[]>} Array of likes
   *
   * @throws {Error} if userId is not provided
   * @throws {Error} if like not found
   */
  async findAllByUserId(userId) {
    if (!userId) throw new Error("userId is required");
    const likes = await this.likeRepository.find({ userId }).catch(() => {
      // TODO: send error to sentry
      throw new FindLikeFailed("userId", userId);
    });

    return Promise.all(
      likes.map(async (like) => {
        const total = await this.likeRepository.count(like.characterId);
        return { like, total };
      })
    ).catch(() => {
      // TODO: send error to sentry
      throw new FindLikeFailed("userId", userId);
    });
  }
  /**
   * Delete a like by id model
   * @param {string} id - Like id model to delete
   * @returns {Promise<Like | null>} Like deleted
   */
  async delete(id) {
    if (!id) throw new LikeIdRequired();
    const like = await this.likeRepository.update(id, { state: false, deleteAt: new Date() }).catch(() => {
      // TODO: send error to sentry
      throw new DeleteLikeFailed(id);
    });

    if (!like) throw new LikeNotFound(id);
    return like;
  }
}
