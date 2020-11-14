const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
})


describe('fav blog', () => {
  const listWithTwoBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422asdf1b54a676234d17f8',
      title: 'Go To Statement Considered Awesome',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 6,
      __v: 0
    }
  ]

  test('returns the fav blogpost', () => {
    const result = listHelper.favoriteBlog(listWithTwoBlogs)
    expect(result).toEqual({
      _id: '5a422asdf1b54a676234d17f8',
      title: 'Go To Statement Considered Awesome',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 6,
      __v: 0
    })
  })
})


describe('most active author', () => {
  const listWithTreeBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422asdf1b54a676234d17f8',
      title: 'Go To Statement Considered Awesome',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 6,
      __v: 0
    },
    {
      _id: '5a422asdf1b5ff676234d17f8',
      title: 'Go To Statement Considered Awesome',
      author: 'michal W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 6,
      __v: 0
    }
  ]

  test('returns the most active author', () => {
    const result = listHelper.mostBlogs(listWithTreeBlogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 2,
    })
  })
})


describe('most popular author', () => {
  const listWithTreeBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422asdf1b54a676234d17f8',
      title: 'Go To Statement Considered Awesome',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 6,
      __v: 0
    },
    {
      _id: '5a422asdf1b5ff676234d17f8',
      title: 'Go To Statement Considered Awesome',
      author: 'michal W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 6,
      __v: 0
    }
  ]

  test('returns the most popular author', () => {
    const result = listHelper.mostLikes(listWithTreeBlogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 11,
    })
  })
})
