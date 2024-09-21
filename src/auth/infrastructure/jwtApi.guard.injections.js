// @ts-check

import { JwtApiGuard } from "../application/jwtApi.guard.js";
import { jwtService } from "../../libs/jwt/infrastructure/jwt.injections.js";

export const jwtApiGuard = new JwtApiGuard(jwtService);
