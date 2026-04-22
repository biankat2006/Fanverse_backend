const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const userRoutes = require('./routes/userRoutes.js')
const mainRoutes = require('./routes/mainRoutes.js')


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:['http://localhost:5173', "https://fanversecentral.netlify.app"],credentials:'include'}))

app.use('/user_pfp', express.static(path.join(__dirname, 'user_pfp')))

app.use('/bigpicture' , express.static(path.join(__dirname , 'bigpicture')))

app.use('/kepek' , express.static(path.join(__dirname , 'kepek')))

app.use('/file', express.static(path.join(__dirname, 'file')))

app.use('/updates', express.static(path.join(__dirname, 'updates')))
app.use('/creator', express.static(path.join(__dirname, 'creator')))



app.use('/users/', userRoutes)
app.use('/main/', mainRoutes ) 


module.exports = app