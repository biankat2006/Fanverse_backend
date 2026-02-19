const db = require('../db/db')

async function findByEmail(email) {
    const sql = 'SELECT * FROM `users` WHERE `email` = ?'
    const [result] = await db.query(sql, [email])
    //console.log(result);

    return result[0] || 0
}

async function createUser(email, username, hash) {
    const sql = 'INSERT INTO `users` (`user_id`, `email`, `username`, `psw`, `pfp`) VALUES (NULL, ?, ?, ?, "nincs")'
    //console.log(sql);
    const [result] = await db.query(sql, [email,username,hash])
    //console.log(result);
    return { insertId: result.insertId }
}

module.exports = { findByEmail, createUser }