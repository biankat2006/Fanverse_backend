const db = require('../db/db')

async function findByEmail(email) {
    const sql = 'SELECT * FROM `users` WHERE `email` = ?'
    const [result] = await db.query(sql, [email])
    //console.log(result);

    return result[0] || 0
}

async function createUser(email, username, hash) {
    const sql = 'INSERT INTO `users` (`user_id`, `email`, `username`, `psw`, `pfp`, role ) VALUES (NULL, ?, ?, ?, "nincs", "user")'
    //console.log(sql);
    const [result] = await db.query(sql, [email,username,hash])
    //console.log(result);
         //
    return { insertId: result.insertId }
}


async function posteditUsername(user_id,username){
    const sql = `UPDATE users SET username=?  WHERE user_id = ? `
    const  [result] = await db.query(sql, [username, user_id])
    return result
}


async function insertpfp(user_id , pfp) {
    const sql = `UPDATE users SET pfp = ? WHERE user_id = ?`
    const [result] = await db.query(sql, [pfp, user_id ])
    return result
}


async function getAllUser(){
    const sql = "SELECT * FROM users"
    const [result] = await db.query(sql)
    return result
}

async function getAllGames() {
    const sql = "SELECT g.game_id, g.title, g.description, g.banner_pic, c.creator_name, GROUP_CONCAT(gi.image SEPARATOR ',') AS images FROM games g INNER JOIN creators c ON g.creator_id = c.creator_id LEFT JOIN game_images gi ON g.game_id = gi.game_id GROUP BY g.game_id, g.title, g.description, g.banner_pic, c.creator_name;"
    const [result] = await db.query(sql)
    return result
}

module.exports = { findByEmail, createUser, posteditUsername ,insertpfp, getAllUser , getAllGames}