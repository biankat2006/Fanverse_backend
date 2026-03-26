const {config} = require('../config/dotenvConfig')
const { findbytitle, allgames } = require('../models/mainModel')

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

module.exports= {search , everything}