// @ts-check

import { Exeption } from "../../common/exeption.js";

export class CredentialsRequired extends Exeption {
  constructor() {
    super("Credentials are required", 400);
  }
}

export class InvalidCredentials extends Exeption {
  constructor() {
    super("Invalid credentials", 401);
  }
}

export class ExpiredToken extends Exeption {
  constructor() {
    super("Expired token", 401);
  }
}
