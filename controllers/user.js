const bcrypt = require('bcrypt')
const User = require('../models/user')
const app = require('express').Router()


app.post('/', async (request, response, next) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(request.body.password, saltRounds)

  if (request.body.password.length < 3) {
    response.status(400).json({ error: 'Password too short' })
    return
  }

  const user = new User({
    username: request.body.username,
    name: request.body.name,
    passwordHash,
  })

  const result = await user.save()
    .then(() => response.status(201).json(result))
    .catch(next)
})

module.exports = app
