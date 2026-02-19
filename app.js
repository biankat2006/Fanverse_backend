const express = require('express')
const cookieParser = require('cookie-parser')

const userRoutes = require('./routes/userRoutes.js')

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/users/', userRoutes)

module.exports = app