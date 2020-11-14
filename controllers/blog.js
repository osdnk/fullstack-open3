require('../helpers/mongo')
const app = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

app.get('/', (request, response) => {
  Blog
    .find({})
    .populate('user')
    .then(blogs => {
      response.json(blogs)
    })
})


app.post('/', async (request, response, next) => {
  const token = request.token
  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const blog = new Blog({ ...request.body, user: user.id })
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(next)
})

app.put('/:id', async (request, response) => {
  await Blog.findByIdAndUpdate(request.params.id, request.body)
  const blog = await Blog.findById(request.params.id)
  response.status(200).json(blog)
})


app.delete('/:id', async (request, response) => {
  const token = request.token
  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() !== decodedToken.id) {
    return response
      .status(401)
      .json({ error: 'Cannot delete a post you are not author of' })
  }
  await blog.remove()
  response.status(204).end()
})

module.exports = app
