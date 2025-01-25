// @ts-check

import { userService } from "../../user/infrastructure/user.injections.js";
import { CommentService } from "../application/comment.service.js";
import { CommentController } from "./comment.controller.js";
import { CommentRepository } from "./comment.repository.js";
import { CommentModel } from "./comments.model.js";

const commentRepository = new CommentRepository(CommentModel);
export const commentService = new CommentService(commentRepository, userService);
export const commentController = new CommentController(commentService);
