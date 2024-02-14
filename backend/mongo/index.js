const mongoose = require('mongoose')
const Blog = require('./models/blog')
const User = require('./models/user')
const { MONGO_URI } = require('../util/config')

if (MONGO_URI && !mongoose.connection.readyState) mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })


module.exports = {
  Blog,
  User
}
