// @ts-check
import bcrypt from "bcrypt";

import { BcryptService } from "../application/bcrypt.service.js";

export const bcryptService = new BcryptService(bcrypt);
