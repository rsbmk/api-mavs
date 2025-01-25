// @ts-check
import jwt from "jsonwebtoken";

import { JwtService } from "../application/jwt.service.js";

export const jwtService = new JwtService(jwt);
