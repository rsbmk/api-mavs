import { Router } from 'express'
import { User } from '../models/users.js'

import bcrypt from 'bcrypt'
const router = Router()

router.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  User.findOne({ username })
    .then(user => {
      if (user) return response.status(401).json({ message: 'this username already exists' })
    }).catch(next)

  try {
    const passwordHash = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      username,
      passwordHash
    })

    const saveUser = await user.save()
    response.json(saveUser)
  } catch (error) {
    next(error)
  }
})

router.get('/', (request, response) => {
  User.find({})
    .then($users => response.json($users))
})

router.get('/:id', (requset, response, next) => {
  const { id } = requset.params

  User.findById(id)
    .then(user => {
      if (user) return response.json(user)
      response.status(404).end()
    }).catch(next)
})

router.put('/', (requset, response, next) => {
  const { username, name, id } = requset.body

  const user = {
    name,
    username
  }

  User.findByIdAndUpdate(id, user, { new: true })
    .then(res => response.json(res))
    .catch(next)
})

router.delete('/', (request, response, next) => {
  const { id } = request.body

  User.findByIdAndDelete(id)
    .then(() => response.status(204).end())
    .catch(next)
})

export default router
