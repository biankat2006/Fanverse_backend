const express = require("express")
const { search, everything , oneGame , toggleLike, getLikes, isLiked } = require("../controllers/mainController")
const { auth } = require("../middleware/userMiddleware")

const router = express.Router()

router.get('/search/:title', search)
router.get('/everything', everything)
router.get('/oneGame/:game_id', oneGame)
router.post('/like/:game_id',auth, toggleLike)
router.get('/likes/:game_id', getLikes)
router.get('/isLiked/:game_id',auth, isLiked)


module.exports = router 