// @ts-check

import "./dbConnection/mongo.js"; // conexion to the database

import cors from "cors";
import express from "express";

// middlewares
import { notFound } from "./src/middleware/notFound.js";

// routes
import { loginRouter } from "./src/auth/infrastructure/login.route.js";
import { commentRouter } from "./src/comments/infrastructure/comment.route.js";
import { likeRouter } from "./src/like/infrastructura/like.route.js";
import { userRouter } from "./src/user/infrastructure/user.route.js";

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
