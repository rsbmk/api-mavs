// @ts-check

import { AuthService } from "../application/auth.service.js";
import { userService } from "../../user/infrastructure/user.injections.js";
import { AuthController } from "./auth.controller.js";
import { jwtService } from "../../libs/jwt/infrastructure/jwt.injections.js";
import { bcryptService } from "../../libs/bcrypt/infrastructure/bcrypt.injections.js";

export const authService = new AuthService(userService, jwtService, bcryptService);
export const authController = new AuthController(authService);
