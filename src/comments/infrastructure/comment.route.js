// @ts-check

import { Router } from "express";
import { jwtApiGuard } from "../../auth/infrastructure/jwtApi.guard.injections.js";
import { commentController } from "./comment.injections.js";

export const commentRouter = Router();

commentRouter
  .use(jwtApiGuard.run.bind(jwtApiGuard))
  .post("/", commentController.create.bind(commentController))
  .get("/characters/:characterId", commentController.findAllByCharacterId.bind(commentController))
  .get("/user", commentController.findAllByUserId.bind(commentController))
  .put("/:id", commentController.update.bind(commentController))
  .delete("/:id", commentController.delete.bind(commentController));
