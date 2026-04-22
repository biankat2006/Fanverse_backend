const {config} = require('../config/dotenvConfig')
const {   findbytitle, 
    allgames, 
    getOneGame, 
    findLike, 
    countLikes,
    addLike,
    removeLike} = require('../models/mainModel')

async function search(req, res) {
    try {
        const {title} = req.params   
      
        if (!title) {
            return res.status(400).json({error:"Töltd ki a keresés mezőt!"})
        }
        const games = await findbytitle(title)
        console.log(games);
        if(games.length === 0){
            return res.status(404).json({error:'Nincs találat '})
        }
        
        return res.status(200).json(games)

    } catch (err) {
        return res.status(500).json({error:"szerver oldali hiba"})
    }
}


async function everything(req, res){
    try {
        const everygame = await allgames()
        return res.status(200).json(everygame)
    } catch (err) {
        return res.status(500).json({error:'szerver oldali hiba', err})
    }
}


async function oneGame(req , res) {
    try {
        const {game_id} = req.params
        if (!game_id) {
            return res.status(400).json({error:"Töltd ki a keresés mezőt!"})
        }
        const OneGame = await getOneGame(game_id)
        return res.status(200).json(OneGame) 
    } catch (err) {
        return res.status(500).json({error:'szerver oldali hiba'})
    }
}

async function toggleLike(req, res) {
    try {
        const { game_id } = req.params

        if (!req.user) {
            return res.status(401).json({ error: "Nincs bejelentkezve" })
        }

        const user_id = req.user.user_id

        if (!game_id || !user_id) {
            return res.status(400).json({ error: "hiányzó adatok" })
        }

        const existing = await findLike(user_id, game_id)

        if (existing.length > 0) {
            await removeLike(user_id, game_id)
            return res.status(200).json({ liked: false })
        }

        await addLike(user_id, game_id)
        return res.status(200).json({ liked: true })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: "szerver oldali hiba" })
    }
}


async function getLikes(req, res) {
    try {
        const { game_id } = req.params

        const result = await countLikes(game_id)

        return res.status(200).json({ count: result })

    } catch (err) {
        return res.status(500).json({ error: "szerver oldali hiba" })
    }
}


async function isLiked(req, res) {
    try {
        const game_id = req.params.game_id
        const user_id = req.user.user_id

        const result = await findLike(user_id, game_id)

        return res.status(200).json({ liked: result.length > 0 })

    } catch (err) {
        return res.status(500).json({ error: "szerver oldali hiba", err })
    }
}


module.exports= {search , everything , oneGame , toggleLike , getLikes , isLiked}