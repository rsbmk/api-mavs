// @ts-check

import { Router } from "express";
import { jwtApiGuard } from "../../auth/infrastructure/jwtApi.guard.injections.js";
import { userController } from "./user.injections.js";

export const userRouter = Router();

// no need auth to create a user
userRouter.post("/signup", userController.create.bind(userController));

userRouter
  .use(jwtApiGuard.run.bind(jwtApiGuard))
  .get("/:id", userController.findOneById.bind(userController))
  .get("/:username/username", userController.findOneByUsername.bind(userController))
  .put("/:id", userController.update.bind(userController))
  .delete("/:id", userController.delete.bind(userController));
