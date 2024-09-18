// @ts-check

import { LikeService } from "../application/like.service";
import { LikeController } from "./like.controller";
import { LikeModel } from "./like.model";
import { LikeRepository } from "./like.repository";

const likeRepository = new LikeRepository(LikeModel);
export const likeService = new LikeService(likeRepository);
export const likeController = new LikeController(likeService);
