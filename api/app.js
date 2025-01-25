// @ts-check

import "./db/mongo.js"; // conexion to the database

import cors from "cors";
import express from "express";

// middlewares
import { notFound } from "./middleware/notFound.js";

// routes
import { loginRouter } from "./auth/infrastructure/login.route.js";
import { commentRouter } from "./comments/infrastructure/comment.route.js";
import { likeRouter } from "./like/infrastructura/like.route.js";
import { userRouter } from "./user/infrastructure/user.route.js";

const app = express();

// midelware top
app.use(cors());
app.use(express.json());

// status
app.use("/status", (req, res) => {
  res.send("OK");
});

// routers
app.use("/v1/api/users", userRouter);
app.use("/v1/api/comments", commentRouter);
app.use("/v1/api/login", loginRouter);
app.use("/v1/api/likes", likeRouter);

// midelware low
app.use(notFound);

export default app;
