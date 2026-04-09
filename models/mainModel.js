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
        const sql = "SELECT game_id ,title , description , banner_pic , creators.creator_pfp , creators.creator_name FROM games INNER JOIN creators ON games.creator_id = creators.creator_id ORDER BY RAND() "
        const [result] = await db.query(sql)
        return result
    }

    async function getOneGame(game_id) {
    // Játék adatainak lekérése a készítő nevével és profilképével
    const [gameRows] = await db.query(`
        SELECT 
            g.game_id,
            g.title,
            g.description,
            g.banner_pic,
            g.game_file,
            c.creator_name,
            c.creator_pfp
        FROM games g
        JOIN creators c ON g.creator_id = c.creator_id
        WHERE g.game_id = ?;
    `, [game_id]);

    if (gameRows.length === 0) return { error: 'game not found' };

    // Bigpicture képek lekérése
    const [bigPicRows] = await db.query(`
        SELECT bigPic FROM bigpicture WHERE game_id = ?
    `, [game_id]);

    // Game_image képek lekérése (kepek mappához)
    const [otherImages] = await db.query(`
        SELECT image FROM game_images WHERE game_id = ?
    `, [game_id]);

    const allImages = [
        ...bigPicRows.map(row => row.bigPic),
        ...otherImages.map(row => row.image)
    ];

    // duplikátumok kiszűrése
    const images = [...new Set(allImages)];

    const game = {
        game_id: gameRows[0].game_id,
        title: gameRows[0].title,
        description: gameRows[0].description,
        banner_pic: gameRows[0].banner_pic,
        creator: gameRows[0].creator_name,
        creator_pfp: gameRows[0].creator_pfp,
        images: images,
        file: gameRows[0].game_file // <-- ide került a játék fájl
    };

    return game;
}


    module.exports = { findbytitle, allgames, getOneGame }