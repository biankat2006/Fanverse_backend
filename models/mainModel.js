const db = require('../db/db')


async function findbytitle(title){
const sql = "SELECT * FROM games WHERE title LIKE ?"
const [result] = await db.query(sql , [`%${title}%`])

return result
}


async function allgames() {
    const sql="SELECT * FROM games "
    const [result] = await db.query(sql)
    return result
}

module.exports = {findbytitle , allgames}