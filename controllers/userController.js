const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { config } = require('../config/dotenvConfig')
const emailValidator = require('node-email-verifier');
const { findByEmail, createUser, posteditUsername, insertpfp, getAllUser, getAllGames, userEdit, userDelete, gameEdit, gameDelete } = require('../models/userModel')

const cookieOPts = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7
}
//regisztráció
async function register(req, res) {
    try {
        const { username, psw, email } = req.body
        console.log(username, psw, email);


        if (!username || !psw) {

            return res.status(400).json({ error: 'Minden mezőt tölts ki' })
        }
        const isValid = await emailValidator(email)
        if (!isValid) {
            return res.status(402).json({ error: "Az email formátuma nem megfelelő" })
        }
        const exist = await findByEmail(email)
        //console.log(exist);
        if (exist) {
            return res.status(409).json({ error: 'Ez az email már létzik!' })
        }

        const hash = await bcrypt.hash(psw, 10)
        //console.log(hash);
        const { insertId } = await createUser(email, username, hash)

        return res.status(201).json({ message: 'Sikeres regisztráció!', insertId })

    } catch (err) {

        if (err.code == 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ez az email már foglalt' })
        }
        //console.log(err);
        return res.status(500).json({ error: 'Szerver oldali hiba regisztrációnál', err })
    }
}

//login
async function login(req, res) {
    try {
        const { email, psw } = req.body
        //console.log(email,psw);

        if (!psw) {
            return res.status(400).json({ error: 'Add a jelszót!' })
        }

        const isValid = await emailValidator(email)
        if (!isValid) {
            return res.status(402).json({ error: "Az email formátuma nem megfelelő" })
        }

        const userSQL = await findByEmail(email)
        console.log(userSQL);

        if (!userSQL) {
            return res.status(401).json({ error: 'Hibás email' })
        }

        const ok = await bcrypt.compare(psw, userSQL.psw)
        //console.log(ok);

        if (!ok) {
            return res.status(401).json({ error: 'Hibás jelszó' })
        }

        const token = jwt.sign(
            { user_id: userSQL.user_id, email: userSQL.email, username: userSQL.username, role: userSQL.role, pfp: userSQL.pfp },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }
        )
        console.log(token);

        res.cookie(config.COOKIE_NAME, token, cookieOPts)
        return res.status(200).json({ message: 'Sikere  s bejelentkezés' })

    } catch (err) {
        //console.log(err);
        if (err.code == 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ez az email vagy username már foglalt' })
        }
        return res.status(500).json({ error: 'Bejelentkezési hiba', err })
    }

}


async function whoAmI(req, res) {
    // Add hozzá a pfp-t a destructuring-hez!
    const { user_id, username, email, role, pfp } = req.user
    try {
        // Küldd vissza a pfp-t is a frontendnek
        return res.status(200).json({
            user_id,
            username,
            email,
            role,
            pfp: pfp // <--- Ez hiányzott!
        })
    } catch (err) {
        return res.status(500).json({ error: 'whoAmI server oldali hiba' })
    }
}

async function logout(req, res) {
    return res.clearCookie(config.COOKIE_NAME, { path: '/' }).status(200).json({ message: 'Sikeres kilépés' })
}




async function editUsername(req, res) {
    const user_id = req.user.user_id
    const { username } = req.body
    console.log(user_id, username);
    try {
        if (!username) {
            return res.status(400).json({ error: 'Add meg az usernamet  ' })

        }
        const result = await posteditUsername(user_id, username)
        return res.status(200).json({ message: "sikeres feltöltés" })
    } catch (err) {
        return res.status(500).json({ error: 'szerver oldali hiba' })
    }

}
async function uploadpfp(req, res) {
    try {
        const user_id = req.params.user_id;
        if (!req.file) return res.status(400).json({ error: 'Nincs fájl' });

        // Mivel a statikus mappád a 'user_pfp', a relatív útvonal 
        // a mappán belül: ID/fájlnév
        const dbPath = `${user_id}/${req.file.filename}`;

        await insertpfp(user_id, dbPath);

        return res.status(201).json({
            message: 'Sikeres feltöltés',
            pfp: dbPath
        });
    } catch (err) {
        return res.status(500).json({ error: 'Hiba' });
    }
}

async function alluser(req, res) {
    try {
        const result = await getAllUser()
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ error: 'adatbázis hiba' })
    }
}


async function allgames(req, res) {
    try {
        const result = await getAllGames()
        return res.status(201).json(result)
    } catch (err) {
        return res.status(500).json({ error: 'adatbázis hiba' })
    }
}

async function editUser(req, res) {
    try {
        const { user_id } = req.params;
        const { username, email, role } = req.body;

        // 1. ELŐSZÖR ellenőrzünk!
        if (!username || !email || !role) {
            return res.status(400).json({ error: 'Minden mezőt tölts ki!' });
        }

        // 2. CSAK UTÁNA küldjük az adatbázisba
        const result = await userEdit(user_id, username, email, role);

        console.log("Sikeres módosítás:", { user_id, username, email, role });
        return res.status(200).json({ message: 'Sikeres szerkesztés' });

    } catch (err) {
        console.error("Backend hiba:", err);
        return res.status(500).json({ error: 'Adatbázis hiba történt!' });
    }
}

async function deleteUser(req, res) {
    try {
        const { user_id } = req.params
        const result = await userDelete(user_id)
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'ilyen felhasználó nem található' })
        }

        return res.status(201).json({ message: 'sikeres törlés' })
    } catch (err) {
        return res.status(500).json({ error: 'adatbázis hiba' })
    }
}

async function editGame(req, res) {
    try {
        const { game_id } = req.params
        const { title, description, creator_name } = req.body
        if (!title || !description || !creator_name) {
            return res.status(400).json({ error: "Minden mezőt tölts ki!" });
        }
        const result = await gameEdit(title, description, game_id, creator_name)
        return res.status(200).json({ message: 'Sikeres szerkesztés' })
    } catch (err) {
        return res.status(500).json({ error: 'adatbázis hiba' })
    }
}

async function deleteGame(req, res) {
    try {
        const { game_id } = req.params

        if (!game_id) {
            return res.status(400).json({ error: 'minden mezőt tölts ki ' })
        }

        const result = await gameDelete(game_id)
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'ilyen játék nem található' })
        }
    } catch (err) {
        return res.status(500).json({ error: 'adatbázis hiba' })
    }
}

module.exports = { register, login, whoAmI, logout, editUsername, uploadpfp, alluser, allgames, editUser, deleteUser, editGame, deleteGame }