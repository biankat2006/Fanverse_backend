const db = require('../db/db')


async function findbytitle(title) {
    const sql =`
        SELECT 
            games.title, 
            games.description, 
            games.banner_pic, 
            creators.creator_pfp, 
            creators.creator_name
        FROM games
        INNER JOIN creators ON games.creator_id = creators.creator_id
        WHERE title LIKE ? 
           OR SOUNDEX(SUBSTRING_INDEX(title, ' ', 1)) = SOUNDEX(?)
    `
    const [result] = await db.query(sql, [`%${title}%`, title])

    return result
}


async function allgames() {
    const sql = "SELECT title , description , banner_pic , creators.creator_pfp , creators.creator_name FROM games INNER JOIN creators ON games.creator_id = creators.creator_id ORDER BY RAND() "
    const [result] = await db.query(sql)
    return result
}

module.exports = { findbytitle, allgames }