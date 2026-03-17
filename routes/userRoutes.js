const express = require('express')
const { register, login, whoAmI, logout , editUsername, uploadpfp } = require('../controllers/userController.js')
const { auth } = require('../middleware/userMiddleware')
const {upload } = require('../middleware/uploadpfp.js')


const router = express.Router()

router.post('/register', register)
router.post('/login',login)
router.get('/whoami', auth, whoAmI)
router.post('/logout',auth ,logout)
router.post('/editUsername', auth , editUsername)
router.post('/uploadpfp', auth ,upload.single('pfp'), uploadpfp )

module.exports = router