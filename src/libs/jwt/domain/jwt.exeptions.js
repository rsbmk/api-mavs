// @ts-check

import { Exeption } from "../../../common/exeption.js";

export class TokenRequired extends Exeption {
  constructor() {
    super("The token is required", 401);
  }
}

export class TokenDataRequired extends Exeption {
  constructor() {
    super("The token data is required", 401);
  }
}
