// @ts-check

import { LikeService } from "../application/like.service.js";
import { LikeController } from "./like.controller.js";
import { LikeModel } from "./like.model.js";
import { LikeRepository } from "./like.repository.js";

const likeRepository = new LikeRepository(LikeModel);
export const likeService = new LikeService(likeRepository);
export const likeController = new LikeController(likeService);
