const multer = require('multer')
const path = require('path')
const fs = require('fs')

const MAX_FILE_SIZE = 1024*1024*10

const storage = multer.diskStorage({
    destination:(req , file , cb)=>{
        const {user_id} = req.user
        if (!user_id) {
            return cb(new Error('hiányzik a  zsűri azonosító'),null)
        }
        const uploadDir = path.join(process.cwd(), 'user_pfp', String(user_id))

        try{
            fs.mkdirSync(uploadDir , {recursive:true})
            return cb(null, uploadDir)
        }catch(err){
            return cb(err , null)
        }
    },
    filename: (req ,file , cb)=>{
        const {user_id} = req.user

        if (!user_id) {
            return cb(new Error('Nincs bejelentkezve'),null)
        }
        const now = new Date().toISOString().split('T')[0]
        return cb(null , `${user_id}-${now}-${file.originalname}`)
    }
})

const upload = multer({
    storage : storage, 
    limits: {fileSize:MAX_FILE_SIZE},
    fileFilter: (req, file , cb )=>{
        const filetype = /jpg|jpeg|png|gif|svg|webp|avif|bmp|tiff/
        const extName = filetype.test(path.extname(file.originalname).toLowerCase())

        const mimtype = filetype.test(file.mimetype)

        if(extName && mimtype){
            return cb(null , true )
        }else{
            return cb(new Error('csak a képformátum megengedett'), null )
        }
    }
})

module.exports = {upload}