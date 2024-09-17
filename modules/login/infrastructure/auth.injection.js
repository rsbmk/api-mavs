// @ts-check

import { AuthService } from "../application/auth.service.js";
import { userService } from "../../user/infrastructure/user.injections.js";
import { AuthController } from "./auth.controller.js";

export const authService = new AuthService(userService);
export const authController = new AuthController(authService);
