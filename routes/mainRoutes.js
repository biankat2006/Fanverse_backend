const express = require("express")
const { search, everything } = require("../controllers/mainController")

const router = express.Router()

router.get('/search/:title', search)
router.get('/everything', everything)

module.exports = router 