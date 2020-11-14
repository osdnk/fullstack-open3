// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => blogs.reduce((acc, curr) => acc + curr.likes, 0)
const favoriteBlog = (blogs) => blogs.sort((a, b) => b.likes - a.likes)[0]
const mostLikes = (blogs) => Object.values(blogs.reduce((acc, curr) => {
  if (!acc[curr.author]) {
    acc[curr.author] = { author: curr.author, likes: 0 }
  }
  acc[curr.author].likes += curr.likes
  return acc
}, {})).sort((a, b) => b.likes - a.likes)[0]


const mostBlogs = (blogs) => Object.values(blogs.reduce((acc, curr) => {
  if (!acc[curr.author]) {
    acc[curr.author] = { author: curr.author, blogs: 0 }
  }
  acc[curr.author].blogs += 1
  return acc
}, {})).sort((a, b) => b.blogs - a.blogs)[0]

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
