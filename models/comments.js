import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const commentSchema = new mongoose.Schema({
  idCharacter: { type: Number, required: true },
  comment: { type: String, required: true },
  user: {
    type: Object
    /* type: mongoose.Schema.Types.ObjectId,
    ref: 'User' */
  }
})

commentSchema.plugin(uniqueValidator)// unique validator use

commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject.user.__v
    delete returnedObject.user._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const Comment = mongoose.model('Comment', commentSchema)
