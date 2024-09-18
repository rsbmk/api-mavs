// @ts-check

import { Exeption } from "../../common/exeption.js";

export class UserIdRequired extends Exeption {
  constructor() {
    super("The userId is required", 400);
  }
}

export class CharacterIdRequired extends Exeption {
  constructor() {
    super("The characterId is required", 400);
  }
}

export class CommentDataRequired extends Exeption {
  constructor() {
    super("The comment and characterId is required", 400);
  }
}

export class TransactionFailed extends Exeption {
  constructor() {
    super("Transaction failed", 422);
  }
}

export class CommentRequiered extends Exeption {
  constructor() {
    super("The comment is required", 400);
  }
}
