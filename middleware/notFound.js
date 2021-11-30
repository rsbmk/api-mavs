export const notFound = (request, response, next) => {
  response.status(404).json({ message: 'not found' })
}
