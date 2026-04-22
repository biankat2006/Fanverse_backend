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

async function userEdit(user_id,  username , email ,role){
    const sql = 'UPDATE users SET email = ?, username = ?, role = ? WHERE user_id = ?'
    const [result] = await db.query(sql, [email,username,  role, user_id])
    return result
}

async function userDelete(user_id) {
    const sql = `DELETE FROM users WHERE user_id =? `
    const [result] = await db.query(sql , [user_id])
    return result
}

async function gameEdit(title, description,game_id ,creator_name) {
    const sql = `UPDATE games
JOIN creators ON games.creator_id = creators.creator_id
SET 
    games.title = ?,
    games.description = ?,
    creators.creator_name = ?
WHERE games.game_id = ?;`
    const [result] = await db.query(sql, [title, description,creator_name ,game_id ])
    return result
}

async function gameDelete(game_id) {
    // 1. Először töröljük az összes olyan rekordot a többi táblából, 
    // ami erre a game_id-ra hivatkozik.
    // A sorrend mindegy, amíg a fő 'games' táblát hagyjuk utoljára.
    
    await db.query(`DELETE FROM game_images WHERE game_id = ?`, [game_id]);
    await db.query(`DELETE FROM comments WHERE game_id = ?`, [game_id]);
    await db.query(`DELETE FROM likes WHERE game_id = ?`, [game_id]);
    await db.query(`DELETE FROM favourite WHERE game_id = ?`, [game_id]);
    await db.query(`DELETE FROM bigpicture WHERE game_id = ?`, [game_id]);

    // 2. Most, hogy már egyetlen tábla sem hivatkozik a játékra, 
    // biztonságosan törölhetjük a fő táblából.
    const sql = `DELETE FROM games WHERE game_id = ?`;
    const [result] = await db.query(sql, [game_id]);

    return result;
}   

module.exports = { findByEmail, createUser, posteditUsername ,insertpfp, getAllUser , getAllGames , userEdit, userDelete , gameEdit , gameDelete}