// @ts-check

/**
 * @typedef {import('../domain/commnet.type').Comment} Comment
 * @typedef {mongoose.Model<Comment, any, any, any, mongoose.Document<unknown, any, Comment> & Comment & {_id: mongoose.Types.ObjectId;}, any>} CommentModel
 */

import mongoose from "mongoose";

/** @type {mongoose.Schema<Comment>} */
const schema = new mongoose.Schema({
  characterId: { type: Number, required: true },
  comment: { type: String, required: true },
  state: { type: Boolean, default: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: null },
  user: {
    id: { type: String, required: true },
    username: { type: String, required: true },
  },
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

/** @type {CommentModel} */
export const CommentModel = mongoose.model("Comment", schema);
