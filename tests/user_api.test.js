jest.useFakeTimers()

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

describe('logging in', () => {
  test('creates and logs in with correct password', async () => {
    await api.post('/api/users').send({
      username: 'Test123',
      name: 'John',
      password: '123123',
    })
    const loginrequest = await api.post('/api/login').send({
      username: 'Test123',
      password: '123123',
    })

    expect(loginrequest.status).toBe(200)
  })

  test('creates and doesnt log in with incorrect password', async () => {
    await api.post('/api/users').send({
      username: 'Test123',
      name: 'John',
      password: '123123',
    })
    const loginrequest = await api.post('/api/login').send({
      username: 'Test123',
      password: '1231dd23',
    })

    expect(loginrequest.status).toBe(401)
  })
})


afterAll(() => {
  mongoose.connection.close()
})
