import { Router } from 'express'

import { Comment } from '../models/comments.js'
import { User } from '../models/users.js'

import { jwtMiddleware } from '../middleware/userExtractor.js'

const router = Router()

router.get('/', async (request, response, next) => {
  try {
    const listComments = await Comment.find({})
    response.json(listComments)
  } catch (error) {
    next(error)
  }
})

router.put('/', async (request, response, next) => {
  const { idComment, comment } = request.body

  if (!(idComment && comment)) return response.status(404).json({ message: 'the parameters are wrong' })

  const newComment = { comment }

  try {
    await Comment.findByIdAndUpdate(
      idComment,
      newComment,
      { new: true }
    )
    const commetList = await Comment.find({})
    response.json(commetList)
  } catch (error) {
    next(error)
  }
})

router.delete('/', async (request, response, next) => {
  const { idComment } = request.body

  if (!idComment) return response.status(404).json({ message: 'the parameters are wrong' })

  try {
    await Comment.findByIdAndRemove(idComment)

    const commetList = await Comment.find({})
    response.json(commetList)
  } catch (error) {
    next(error)
  }
})

router.post('/', jwtMiddleware, async (request, response, next) => {
  const { comment, idCharacter } = request.body
  const { userId } = request

  if (!comment || !idCharacter) response.status(400).json({ message: 'Bad request' })

  try {
    const userComment = await User.findById(userId)
    const { name, username } = userComment

    const newComments = new Comment({
      idCharacter,
      comment,
      user: {
        name,
        username
      }
    })

    await newComments.save()
    const listComments = await Comment.find({})
    response.json(listComments)
  } catch (error) {
    next(error)
  }
})

export default router
