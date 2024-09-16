// @ts-check

import "./dbConnection/mongo.js"; // conexion to the database

import cors from "cors";
import express from "express";

import { notFound } from "./middleware/notFound.js";
import { handleErrors } from "./middleware/handleErrors.js";
import { jwtMiddleware } from "./middleware/userExtractor.js";

import { userRouter } from "./modules/user/infrastructure/user.route.js";
import characterRouter from "./controllers/likes.js";
import loginRouter from "./controllers/login.js";
import commentsRouter from "./controllers/comments.js";

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
app.use("/v1/api/login", loginRouter);
app.use("/v1/api/characters", jwtMiddleware, characterRouter);
app.use("/v1/api/comments", commentsRouter);

// midelware low
app.use(notFound);
app.use(handleErrors);

export default app;
