const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://admin:${password}@cluster0.7dvly.mongodb.net/personss?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (!process.argv[3]) {
  Person.find({}).then((people) => {
    console.log('Phonebook:')
    people.forEach((person) => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
  return
}

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

person.save().then(() => {
  console.log('boom')
  mongoose.connection.close()
})
