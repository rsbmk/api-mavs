// @ts-check
import jwt from "jsonwebtoken";

import { JwtService } from "../../libs/jwt/application/jwt.service.js";
import { JwtApiGuard } from "../application/jwtApi.guard.js";

export const jwtApiGuard = new JwtApiGuard(new JwtService(jwt));
