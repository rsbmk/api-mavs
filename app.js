// @ts-check

import "./dbConnection/mongo.js"; // conexion to the database

import cors from "cors";
import express from "express";

// middlewares
import { notFound } from "./src/middleware/notFound.js";
import { handleErrors } from "./src/middleware/handleErrors.js";
import { jwtMiddleware } from "./src/middleware/userExtractor.js";

// routes
import { userRouter } from "./src/user/infrastructure/user.route.js";
import { commentRouter } from "./src/comments/infrastructure/comment.route.js";
import { loginRouter } from "./src/login/infrastructure/login.route.js";
import { likeRouter } from "./src/like/infrastructura/like.route.js";

const app = express();

// settings
app.set("port", 3001);

// midelware top
app.use(cors());
app.use(express.json());

// status
app.use("/status", (req, res) => {
  res.send("OK");
});

// routers
app.use("/v1/api/users", userRouter);
app.use("/v1/api/comments", jwtMiddleware, commentRouter);
app.use("/v1/api/login", loginRouter);
app.use("/v1/api/likes", jwtMiddleware, likeRouter);

// midelware low
app.use(notFound);
app.use(handleErrors);

export default app;
