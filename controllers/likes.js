import { Router } from "express";
import { UserModel } from "../models/users.js";

const router = Router();

router.get("/", (request, response, next) => {
  const { userId } = request;

  UserModel.findById(userId)
    .then((user) => {
      response.json(user.characters);
    })
    .catch(next);
});

router.post("/", (request, response, next) => {
  const { idCharacter } = request.body;
  const { userId } = request;

  UserModel.findById(userId)
    .then((user) => {
      if (user.characters.includes(idCharacter)) {
        return response.status(400).json({ message: "this id already exists" });
      }

      user.characters = [...user.characters, idCharacter];
      response.status(201).json(user.characters);
      user.save();
    })
    .catch(next);
});

router.delete("/", (request, response, next) => {
  const { userId } = request;
  const { idCharacter } = request.body;

  UserModel.findById(userId)
    .then((user) => {
      user.characters = user.characters.filter((idC) => idC !== idCharacter);
      response.json(user.characters);
      user.save();
    })
    .catch(next);
});

export default router;
