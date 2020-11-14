const mongoose = require('mongoose')
const uv = require('mongoose-unique-validator')
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
  },
  blogs: [{ type: ObjectId, ref: 'Blog' }],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

userSchema.plugin(uv)

const User = mongoose.model('User', userSchema)

module.exports = User
