// @ts-check

import { Router } from "express";
import { userController } from "./user.injections.js";

export const userRouter = Router();

userRouter
  .post("/", userController.create.bind(userController))
  .get("/:id", userController.findOneById.bind(userController))
  .get("/:username/username", userController.findOneByUsername.bind(userController))
  .put("/:id", userController.update.bind(userController))
  .delete("/:id", userController.delete.bind(userController));
