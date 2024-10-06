// @ts-check

/**
 * @typedef {import('../domain/like.type').Like} Like
 * @typedef {mongoose.Model<Like, any, any, any, mongoose.Document<unknown, any, Like> & Like & {_id: mongoose.Types.ObjectId;}, any>} LikeModel
 */

import mongoose from "mongoose";

/** @type {mongoose.Schema<Like>} */
const schema = new mongoose.Schema({
  userId: { type: String, required: true },
  characterId: { type: Number, required: true },
  state: { type: Boolean, default: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: null },
});

schema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

schema.set("toObject", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

/** @type {LikeModel} */
export const LikeModel = mongoose.model("Like", schema);
