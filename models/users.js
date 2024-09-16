// @ts-check

/**
 * @typedef {import('../modules/user/domain/user.type').User} User
 * @typedef {mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User> & User & {_id: mongoose.Types.ObjectId;}, any>} UserModel
 */

import mongoose from "mongoose";

/** @type {mongoose.Schema<User>} */
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  characters: { type: [], default: [] },
  state: { type: Boolean, default: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: null },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject.password;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

/**
 * @type {UserModel}
 */
export const UserModel = mongoose.model("User", userSchema);
