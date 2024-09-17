import jwt from "jsonwebtoken";
import { SECRET_JWT } from "../modules/utils/constants.js";

export const jwtMiddleware = (request, response, next) => {
  // recuperamos el token de la cabecera para autorizar
  const authorization = request.get("authorization");

  let token = "";

  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
  }

  let decodeToken;
  try {
    decodeToken = jwt.verify(token, SECRET_JWT);
  } catch (error) {
    console.log({ error });
    return response.status(401).json({ message: "no authorization" });
  }

  if (!token || !decodeToken.id) {
    return response.status(401).json({ message: "no authorization" });
  }

  const { id } = decodeToken;
  request.userId = id;

  next();
};
