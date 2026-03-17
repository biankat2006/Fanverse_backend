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


module.exports = { findByEmail, createUser, posteditUsername ,insertpfp }