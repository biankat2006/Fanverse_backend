const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes.js')
const mainRoutes = require('./routes/mainRoutes.js')


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:['http://localhost:5173'],credentials:'include'}))

app.use('/users/', userRoutes)
app.use('/main/', mainRoutes )


module.exports = app