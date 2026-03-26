    function adminCheck (req ,res , next) {
        try {
            if(!req.user){
                return res.status(401).json({error:"nincs hitelesítve"})
            }
            if (req.user.role !=="admin") {
                return res.status(401).json({error:'nincs jogosultásgod hozzáférni'})
            }
            next()

        } catch (err) {
            return res.status(500).json({error:'szerver oldali hiba ', err})
        }
    }

    module.exports = {adminCheck}