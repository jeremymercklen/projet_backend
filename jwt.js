const jwt = require('jsonwebtoken')
const jwtKey = 'exemple_cours_secret_key'
const jwtExpirySeconds = 10

module.exports = (userAccountService) => {
    return {
        validateJWT(req, res, next) {
            if (req.headers.authorization === undefined) {
                return res.status(401).end()
            }
            if (!req.headers.authorization.startsWith("Bearer ")) {
                return res.status(400).end()
            }
            const token = req.headers.authorization.split(" ")[1]
            jwt.verify(token, jwtKey, {algorithm: "HS256"},  async (err, user) => {
                if (err) {
                    return res.status(401).end()
                }
                try {
                    req.user = await userAccountService.dao.getByLogin(user.login)
                    if (req.user == null) {
                        return res.status(401).end()
                    }
                    return next()
                } catch(e) {
                    console.log(e)
                    return res.status(401).end()
                }

            })
        },
        generateJWT(login) {
            return jwt.sign({login}, jwtKey, {
                algorithm: 'HS256',
                expiresIn: jwtExpirySeconds
            })
        }
    }
}