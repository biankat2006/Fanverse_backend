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

async function getOneGame(game_id) {
    const sql = `
    SELECT 
        g.game_id,
        g.title,
        g.description,
        g.banner_pic,
        c.creator_name,
        gi.image
    FROM games g
    JOIN creators c ON g.creator_id = c.creator_id
    LEFT JOIN game_images gi ON g.game_id = gi.game_id
    WHERE g.game_id = ?;
    `;

    const [rows] = await db.query(sql, [game_id]);

    if (rows.length === 0) return null;

    const game = {
        game_id: rows[0].game_id,
        title: rows[0].title,
        description: rows[0].description,
        banner_pic: rows[0].banner_pic,
        creator: rows[0].creator_name,
        images: []
    };

    rows.forEach(row => {
        if (row.image) {
            game.images.push(row.image);
        }
    });

    return game;
}



module.exports = { findbytitle, allgames, getOneGame }