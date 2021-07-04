import dotenv from 'dotenv'

import './dbConnection/mongo.js' // conexion a la base de datos

import cors from 'cors'
import express from 'express'

import { notFound } from './middleware/notFound.js'
import { handleErrors } from './middleware/handleErrors.js'
import { jwtMiddleware } from './middleware/userExtractor.js'

import userRouter from './controllers/users.js'
import characterRouter from './controllers/character.js'
import loginRouter from './controllers/login.js'
import commentsRouter from './controllers/comments.js'
dotenv.config()

const app = express()

// settings
app.set('port', 3001)

// midelware top
app.use(cors())
app.use(express.json())

// routers
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/characters', jwtMiddleware, characterRouter)
app.use('/api/comments', commentsRouter)

// midelware low
app.use(notFound)
app.use(handleErrors)

// server
const $PORT = process.env.PORT || app.get('port')
app.listen($PORT, () => {
  console.log('server run on port', app.get('port'))
})
