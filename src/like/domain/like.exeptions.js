// @ts-check
import { Exeption } from "../../common/exeption.js";

export class LikeDataRequiered extends Exeption {
  constructor() {
    super("The characterId and userId are required", 400);
  }
}

export class LikeAlreadyExists extends Exeption {
  constructor() {
    super("Like already exists", 400);
  }
}

export class CreateLikeFailed extends Exeption {
  /**
   * @param {number} characterId - The characterId
   * @param {string} userId - The userId
   */
  constructor(characterId, userId) {
    super(`Error creating like, for characterId: ${characterId} and userId: ${userId}`, 400);
  }
}

export class FindLikeFailed extends Exeption {
  /**
   * @param {"userId" | "characterId"} entity - The entity type
   * @param {string | number} id - The entity id
   */
  constructor(entity, id) {
    super(`Error finding like, for ${entity}: ${id}`, 400);
  }
}

export class DeleteLikeFailed extends Exeption {
  /**
   * @param {string} id - The like id
   */
  constructor(id) {
    super(`Error deleting like, for id: ${id}`, 400);
  }
}

export class LikeNotFound extends Exeption {
  /**
   * @param {string | number} id - The like id
   */
  constructor(id) {
    super(`Like not found, for id: ${id}`, 404);
  }
}

export class LikeIdRequired extends Exeption {
  constructor() {
    super("The commentId is required", 400);
  }
}
