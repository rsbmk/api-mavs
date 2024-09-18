// @ts-check

import { Router } from "express";
import { commentController } from "./comment.injections.js";
import { jwtApiGuard } from "../../auth/infrastructure/jwtApi.guard.injections.js";

export const commentRouter = Router();

commentRouter
  .use(jwtApiGuard.run.bind(jwtApiGuard))
  .post("/", commentController.create.bind(commentController))
  .get("/:characterId/character", commentController.findAllByCharacterId.bind(commentController))
  .get("/:userId/user", commentController.findAllByUserId.bind(commentController))
  .put("/:id", commentController.update.bind(commentController))
  .delete("/:id", commentController.delete.bind(commentController));
