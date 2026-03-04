const db = require('../db/db')


async function findbytitle(title) {
    const sql = "SELECT title , description , banner_pic , creators.creator_pfp , creators.creator_name FROM games INNER JOIN creators ON games.creator_id =creators.creator_id  WHERE title LIKE ?"
    const [result] = await db.query(sql, [`%${title}%`])

    return result
}


async function allgames() {
    const sql = "SELECT title , description , banner_pic , creators.creator_pfp , creators.creator_name FROM games INNER JOIN creators ON games.creator_id = creators.creator_id "
    const [result] = await db.query(sql)
    return result
}

module.exports = { findbytitle, allgames }