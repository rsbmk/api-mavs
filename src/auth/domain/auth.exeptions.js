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
