require('dotenv').config()
const mongoose = require('mongoose')
const mongoUrl = `mongodb+srv://admin:${process.env.PASSWORD}@cluster0.7dvly.mongodb.net/personss?retryWrites=true&w=majority`
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
