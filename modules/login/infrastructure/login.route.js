// @ts-check

import { Router } from "express";
import { authController } from "./auth.injection.js";

export const loginRouter = Router();

loginRouter.post("/", authController.login.bind(authController));
