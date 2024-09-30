// @ts-check

import { CreateLikeFailed, DeleteLikeFailed, FindLikeFailed, LikeAlreadyExists, LikeDataRequiered, LikeIdRequired, LikeNotFound } from "../domain/like.exeptions.js";

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
    if (likeExist.length) throw new LikeAlreadyExists();

    return this.likeRepository.create(like).catch(() => {
      // TODO: send error to sentry
      throw new CreateLikeFailed(characterId, userId);
    });
  }

  /**
   * Find the numbers of like that a character has
   * @param {number} characterId - The character id
   * @returns {Promise<{total: number}>} The number of likes
   *
   * @throws {Error} if characterId or userId are not provided
   */
  async findAllByCharacterId(characterId) {
    if (!characterId) throw new LikeDataRequiered();

    const likes = await this.likeRepository.count(characterId).catch(() => {
      // TODO: send error to sentry
      throw new FindLikeFailed("characterId", characterId);
    });

    return { total: likes };
  }

  /**
   * Find all likes by user id
   * @param {string} userId - User id to find likes
   * @returns {Promise<Like[]>} Array of likes
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

    if (!likes || !likes.length) throw new LikeNotFound(userId);
    return likes;
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
