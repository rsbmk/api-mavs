// @ts-check

import { Router } from "express";

import { CommentController } from "./comment.controller.js";
import { CommentService } from "../application/comment.service.js";
import { CommentRepository } from "./comment.repository.js";
import { CommentModel } from "./comments.model.js";

const commentController = new CommentController(new CommentService(new CommentRepository(CommentModel)));
export const commentRouter = Router();

commentRouter
  .post("/", commentController.create.bind(commentController))
  .get("/:characterId/character", commentController.findAllByCharacterId.bind(commentController))
  .get("/:userId/user", commentController.findAllByUserId.bind(commentController))
  .put("/:id", commentController.update.bind(commentController))
  .delete("/:id", commentController.delete.bind(commentController));
