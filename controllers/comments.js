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

router.put('/', (request, response, next) => {
  const { idComment, comment } = request.body

  const newComment = { comment }

  Comment.findByIdAndUpdate(idComment, newComment, { new: true })
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

router.post('/', jwtMiddleware, async (request, response, next) => {
  console.log('vino')

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
