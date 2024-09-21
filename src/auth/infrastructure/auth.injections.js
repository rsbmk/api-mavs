// @ts-check

import { AuthService } from "../application/auth.service.js";
import { userService } from "../../user/infrastructure/user.injections.js";
import { AuthController } from "./auth.controller.js";
import { jwtService } from "../../libs/jwt/infrastructure/jwt.injections.js";

export const authService = new AuthService(userService, jwtService);
export const authController = new AuthController(authService);
