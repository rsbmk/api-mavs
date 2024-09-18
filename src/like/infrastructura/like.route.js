// @ts-check

import { Router } from "express";
import { likeController } from "./like.injections.js";
import { jwtApiGuard } from "../../auth/infrastructure/jwtApi.guard.injections.js";

export const likeRouter = Router();

likeRouter
  .use(jwtApiGuard.run.bind(jwtApiGuard))
  .post("/", likeController.create.bind(likeController))
  .get("/:characterId/character", likeController.findAllByCharacterId.bind(likeController))
  .get("/:userId/user", likeController.findAllByUserId.bind(likeController))
  .delete("/:id", likeController.delete.bind(likeController));
