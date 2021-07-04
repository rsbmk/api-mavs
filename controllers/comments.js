import { json, Router } from "express";
import { Comment } from '../models/comments.js'
import { User } from "../models/users.js";

const router = Router()

router.get('/', (request, response, next) => {
  Comment.find({})
  .then(commet => {
    response.json(commet)
  }).catch(next)
})

router.put('/', (request, response, next) => {
  const { idComment, comment } = request.body
  
  const newComment = {comment}
  
  Comment.findByIdAndUpdate(idComment, newComment, {new: true})
  .then(res => response.json(res))
  .catch(next)

})

router.delete('/', async (request, response, next) => {
  const { idComment } = request.body
  try {
    const commentsRes = await Comment.findByIdAndRemove(idComment)
    response.status(202).json(commentsRes)
  } catch (error) {
    next(error)
  }

})

router.post('/', async(request, response, next) =>{
  const {comment, idCharacter, userId} = request.body

  if(!comment || !idCharacter) response.status(400).json({message: 'Bad request'})

  try {
    const userComment = await User.findById(userId)
    const {name, username} = userComment

    const newComments = new Comment({
      idCharacter,
      comment,
      user: {
        name,
        username
      }
    })
    
    const saveComment = await newComments.save()
    response.json(saveComment)

  } catch (error) {
    next(error)
  }

})

export default router