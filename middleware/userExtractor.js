import jwt from 'jsonwebtoken'

export const jwtMiddleware = (request, response, next) => {
  // recuperamos el token de la cabecera para autorizar
  const authorization = request.get('authorization')

  let token = ''

  if (authorization && authorization.toLocaleLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  const decodeToken = jwt.verify(token, process.env.SECRET_JWT)

  if (!token || !decodeToken.id) {
    return response.status(401).json({ message: 'no authorization' })
  }

  const { id } = decodeToken
  request.userId = id

  next()
}
