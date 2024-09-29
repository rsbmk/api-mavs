// @ts-check

import { Router } from "express";
import { jwtApiGuard } from "../../auth/infrastructure/jwtApi.guard.injections.js";
import { likeController } from "./like.injections.js";

export const likeRouter = Router();

likeRouter
  .use(jwtApiGuard.run.bind(jwtApiGuard))
  .post("/", likeController.create.bind(likeController))
  .get("/:characterId/character", likeController.findAllByCharacterId.bind(likeController))
  .get("/user", likeController.findAllByUserId.bind(likeController))
  .delete("/:id", likeController.delete.bind(likeController));
