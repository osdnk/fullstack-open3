jest.useFakeTimers()

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)


const listWithTreeBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Go To Statement Considered Awesome',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 6,
  },
  {
    title: 'Go To Statement Considered Awesome',
    author: 'michal W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 6,
  },
  {
    title: 'Go To Statement Considered X',
    author: 'David W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 2,
  }
]

const initialUser = {
  username: 'osdnk',
  name: 'michas',
  password: '123123',
}

const anotherUser = {
  username: 'osdnkk',
  name: 'mich',
  password: '1233',
}

let token = null
let anotherToken = null

beforeAll(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  await api.post('/api/users').send(initialUser)
  await api.post('/api/users').send(anotherUser)

  const response = await api
    .post('/api/login')
    .send({ username: initialUser.username, password: initialUser.password })

  anotherToken = (await api
    .post('/api/login')
    .send({ username: anotherUser.username, password: anotherUser.password })).body.token


  token = response.body.token
  await Blog.deleteMany({})
  for (let b of listWithTreeBlogs) {
    await api.post('/api/blogs')
      .send(b)
      .set('Authorization', `Bearer ${token}`)
  }
})

describe('blogs', () => {
  test('returns JSON', async () => {
    await api
      .get('/api/blogs')
      .expect('Content-Type', /application\/json/)
  })

  test('return 3 elements', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    expect(blogs).toHaveLength(4)
  })

  test('return 3 elements and all have an user', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    expect(blogs[0].user).toBeDefined()
  })

  test('have unique ids', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    const keys = {}

    blogs.forEach((blog) => {
      expect(blog.id).toBeDefined()
      keys[blog.id] = blog.id
    })
    expect(Object.keys(keys)).toHaveLength(blogs.length)
  })
})

describe('create a post', () => {
  test('adding works', async () => {
    const response = await api
      .post('/api/blogs')
      .send({
        title: 'Sample',
        author: 'Lukas',
        likes: 5,
        url: 'https://google.pl',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(201)

    const count = await Blog.countDocuments({})
    expect(count).toBe(5)
  })

  test('likes field defaults to 0', async () => {
    const result = await api
      .post('/api/blogs')
      .send({
        title: 'XXX',
        author: 'Dave',
        url: 'https://google.pl',
      })
      .set('Authorization', `Bearer ${token}`)

    const blog = result.body
    expect(result.status).toBe(201)
    expect(blog.likes).toBe(0)
  })

  test('requires title', async () => {
    const result = await api
      .post('/api/blogs')
      .send({
        url: 'https://google.pl',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(result.status).toBe(400)
  })

  test('requires url', async () => {
    const result = await api
      .post('/api/blogs')
      .send({
        title: 'Michal',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(result.status).toBe(400)
  })
})

describe('deleting a post', () => {
  test('deletes a post', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    const result = await api
      .delete(`/api/blogs/${blogs[0].id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(result.status).toBe(204)

    const newResponse = await api.get('/api/blogs')
    const newBlogs = newResponse.body
    expect(blogs.length - 1).toBe(newBlogs.length)
  })

  test('doesnt delete a post of another user', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    const result = await api
      .delete(`/api/blogs/${blogs[0].id}`)
      .set('Authorization', `Bearer ${anotherToken}`)

    expect(result.status).toBe(401)

    const newResponse = await api.get('/api/blogs')
    const newBlogs = newResponse.body
    expect(blogs.length).toBe(newBlogs.length)
  })
})

describe('updating a post', () => {
  test('increases number of likes', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    const firstPost = blogs[0]
    delete firstPost.user
    const oldNol = firstPost.likes
    firstPost.likes += 1
    const result = await api.put(`/api/blogs/${blogs[0].id}`)
      .send(firstPost)
      .set('Authorization', `Bearer ${token}`)
    expect(result.body.likes).toBe(oldNol + 1)
  })
})




afterAll(() => {
  mongoose.connection.close()
})
