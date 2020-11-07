require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


morgan.token('body', (req) => JSON.stringify(req.body))
const app = express()
app.use(express.static('build'))

app.use(morgan(':method :url :status :response-time ms :body'))
app.use(express.json())
app.use(cors())


app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => response.json(people))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const person = request.body
  if (!person.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const person = request.body
  if (!person.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!person.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const newPerson = new Person({
    name: person.name,
    number: person.number
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})


app.get('/info', (request, response) => {
  Person.find({}).then((people) => response.send(`<h1>Phonebook has ${people.length} entries!</h1><p>${new Date()}</p>`))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



