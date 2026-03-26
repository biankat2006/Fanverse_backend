const express = require('express')
const { register, login, whoAmI, logout , editUsername, uploadpfp, alluser , allgames } = require('../controllers/userController.js')
const { auth } = require('../middleware/userMiddleware')
const {upload } = require('../middleware/uploadpfp.js')
const {adminCheck} = require('../middleware/adminCheck.js')

const router = express.Router()

router.post('/register', register)
router.post('/login',login)
router.get('/whoami', auth, whoAmI)
router.post('/logout',auth ,logout)
router.post('/editUsername', auth , editUsername)
router.post('/uploadpfp', auth ,upload.single('pfp'), uploadpfp )
router.get('/admin/users', auth , adminCheck , alluser)
router.get('/admin/games', auth , adminCheck , allgames)

module.exports = router