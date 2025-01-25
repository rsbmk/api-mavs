// @ts-check

import { UserController } from "./user.controller.js";
import { UserService } from "../application/user.service.js";
import { UserRepository } from "./user.repository.js";
import { UserModel } from "./users.model.js";

import { bcryptService } from "../../libs/bcrypt/infrastructure/bcrypt.injections.js";

const userRepository = new UserRepository(UserModel);
export const userService = new UserService(userRepository, bcryptService);
export const userController = new UserController(userService);
