const ERROR_HANDLES = {
  CastError: response => response.status(400).send({
    message: 'id used is malformed'
  }),
  TokenExpirerError: response => response.status(401).json({ message: 'token expired' }),
  JsonWebTokenError: response => response.status(401).json({ error: 'token missing' }),
  TokenExpiredError: response => response.status(204).json({ message: 'jwt expired' }),
  defaultError: (response, error) => response.status(500).json({ error: error })
}

export const handleErrors = (error = {}, request, response, next) => {
  // console.error(error);

  const handler = ERROR_HANDLES[error.name] || ERROR_HANDLES.defaultError
  handler(response, error)
}
