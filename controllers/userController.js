const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { config } = require('../config/dotenvConfig')
const { findByEmail, createUser, posteditUsername, insertpfp, getAllUser, getAllGames } = require('../models/userModel')

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


        if (!email || !username || !psw ) {

            return res.status(400).json({ error: 'Minden mezőt tölts ki' })
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
        
        if (err.code=='ER_DUP_ENTRY') {
            return res.status(409).json({error: 'Ez az email már foglalt'})
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

        if (!email || !psw) {
            return res.status(400).json({ error: 'Add meg az emailt és a jelszót is' })
        }

        const  userSQL = await findByEmail(email)
        console.log(userSQL);

        if (!userSQL) {
            return res.status(401).json({error: 'Hibás email'})
        }

        const ok = await  bcrypt.compare(psw, userSQL.psw)
        //console.log(ok);

        if (!ok) {
            return res.status(401).json({error: 'Hibás jelszó'})
        }

        const token = jwt.sign(
            {user_id: userSQL.user_id, email: userSQL.email, username: userSQL.username, role: userSQL.role},
            config.JWT_SECRET,
            {expiresIn: config.JWT_EXPIRES_IN}
        )
        console.log(token);

        res.cookie(config.COOKIE_NAME, token, cookieOPts)
        return res.status(200).json({message: 'Sikeres bejelentkezés'})

    } catch (err) {
        //console.log(err);
        if (err.code=='ER_DUP_ENTRY') {
            return res.status(409).json({error: 'Ez az email vagy username már foglalt'})
        }
        return res.status(500).json({error: 'Bejelentkezési hiba', err})
    }

}


async function whoAmI(req,res){
    const {user_id, username, email, role} = req.user
    try {
        return res.status(200).json({user_id: user_id, username: username, email:email , role:role})
    } catch (err) {
        //console.log(err);
        return res.status(500).json({error: 'whoAmI server oldali hiba'})
    }
}

async function logout(req,res){
    return res.clearCookie(config.COOKIE_NAME, {path: '/'}).status(200).json({message:'Sikeres kilépés'})
}




async function editUsername(req , res) {
    const user_id = req.user.user_id
    const { username } = req.body
    console.log(user_id, username);
    try {
        if(!username){
            return res.status(400).json({ error: 'Add meg az usernamet  ' })
            
        }
        const result = await posteditUsername(user_id,username)
        return res.status(200).json({message:"sikeres feltöltés"})
    } catch (err) {
        return res.status(500).json({error:'szerver oldali hiba'})
    }
    
}

async function uploadpfp(req, res) {
  try {
    const {user_id} = req.user
    
    if(!req.file){
        return res.status(400).json({error:'Nincs feltöltött file'})
    }
    const pfp = `user_pfp/${user_id}/${req.file.filename}`

    const result = await insertpfp(user_id ,pfp)
    
    
    return res.status(201).json({message:'sikeres feltöltés', pfp:pfp})

   
  } catch (err) {
    return res.status(500).json({error:'pfp feltöltés hiba'})
  }
}

async function alluser(req, res){
    try {
        const result = await getAllUser()
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({error:'adatbázis hiba'})
    }
}


async function allgames(req , res) {
    try {
        const result = await getAllGames()
        return res.status(201).json(result)
    } catch (err) {
        return res.status(500).json({error:'adatbázis hiba'})
    }
}


module.exports = { register, login, whoAmI, logout, editUsername , uploadpfp, alluser , allgames  }