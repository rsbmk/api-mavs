// @ts-check

import { Router } from "express";

import { UserController } from "./user.controller.js";
import { UserService } from "../application/user.service.js";
import { UserRepository } from "./user.repository.js";
import { UserModel } from "../../../models/users.js";

const userController = new UserController(new UserService(new UserRepository(UserModel)));
export const userRouter = Router();

userRouter
  .post("/", userController.create.bind(userController))
  .get("/:id", userController.findOneById.bind(userController))
  .get("/:username/username", userController.findOneByUsername.bind(userController))
  .put("/:id", userController.update.bind(userController))
  .delete("/:id", userController.delete.bind(userController));
