const express = require("express")
const { search, everything , oneGame } = require("../controllers/mainController")

const router = express.Router()

router.get('/search/:title', search)
router.get('/everything', everything)
router.get('/oneGame/:game_id', oneGame)

module.exports = router 