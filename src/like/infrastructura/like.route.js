import { Router } from "express";
import { likeController } from "./like.injections.js";

export const likeRouter = Router();

likeRouter
  .post("/", likeController.create.bind(likeController))
  .get("/:characterId/character", likeController.findAllByCharacterId.bind(likeController))
  .get("/:userId/user", likeController.findAllByUserId.bind(likeController))
  .delete("/:id", likeController.delete.bind(likeController));
