// @ts-check
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Router } from "express";
import { UserModel } from "../models/users.js";

const router = Router();

router.post("/", async (request, response, next) => {
  const { username, password } = request.body;

  const user = await UserModel.findOne({ username });
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    response.status(401).json({
      message: "invalid user or password",
    });
  }

  const userForToken = {
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET_JWT, {
    expiresIn: 60 * 60,
  });

  response.json({
    name: user.name,
    username: user.username,
    jwt: token,
    id: user._id,
  });
});

export default router;
