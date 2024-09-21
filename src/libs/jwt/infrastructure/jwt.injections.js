// @ts-check
import jwt from "jsonwebtoken";

import { JwtService } from "../application/jwt.service";

export const jwtService = new JwtService(jwt);
