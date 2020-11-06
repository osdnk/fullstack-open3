const express = require('express')
const morgan = require("morgan");
const cors = require('cors')

morgan.token("body", (req) => JSON.stringify(req.body));
const app = express()
app.use(express.static('build'))

app.use(morgan(":method :url :status :response-time ms :body"));
app.use(express.json())
app.use(cors())

let persons = [
  { id: 1, name: 'Arto Hellas', number: '000-000-0000' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = persons.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(note => note.id !== id)

  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  const id = Math.floor(Math.random() * 100000000)
  const person = request.body
  person.id = `${id}`
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

  if (persons.find(note => note.name === person.name)) {
    return response.status(400).json({
      error: 'person exists'
    })
  }

  persons = persons.concat(person)
  response.json(person)
})

app.get('/info', (request, response) => {
  response.send(`<h1>Phonebook has ${persons.length} entries!</h1><p>${new Date()}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

