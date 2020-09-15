const jwt       = require('jsonwebtoken');
const TOKEN_KEY = process.env.TOKEN_KEY;

module.exports = {
    createToken : (data) => {
        return jwt.sign(data, TOKEN_KEY)
    },

    //verify token as middleware
    verify : (req, res, next) => {
        const token = req.body.token

        //check token
        if(!token) {
            return res.status(400).send('no token')
        }

        try {
            //verify token
            const result = jwt.verify(token, TOKEN_KEY)

            //add token data to request
            req.user = result

            //next : dipakai untuk middleware
            next()
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }
}

