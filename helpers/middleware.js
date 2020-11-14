const token = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization) {
    request.token = authorization.substring(7)
  }
  next()
}

module.exports = token
