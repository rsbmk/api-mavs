// @ts-check
import { Exeption } from "../../common/exeption.js";

export class UserDataRequired extends Exeption {
  constructor() {
    super("The user information is required", 400);
  }
}

export class UserAlreadyExists extends Exeption {
  /**
   * @param {string} username - The username already exists
   */
  constructor(username) {
    super(`The username ${username} already exists`, 400);
  }
}

export class FailedlUser extends Exeption {
  /**
   * @param {string} username - The username
   */
  constructor(username) {
    super(`Error processing user: ${username}`, 400);
  }
}

export class UserNotFound extends Exeption {
  constructor() {
    super("The user not found", 404);
  }
}
