module.exports = (app, svc, jwt) => {

    app.post('/useraccount/authenticate', async (req, res) => {
        const {login, password} = req.body
        if ((login === undefined) || (password === undefined)) {
            return res.status(400).end()
        }
        svc.validatePassword(login, password)
            .then(user => {
                if (user == null) {
                    res.status(401).end()
                    return
                }
                console.log(`${user.login} authenticated`)
                return res.json({
                    'login' : user.login,
                    'token': jwt.generateJWT(login)
                })
            })
            .catch(e => {
                console.log(e)
                return res.status(500).end()
            })
    })

    app.post('/useraccount', async (req, res) => {
        const {login, password} = req.body
        if ((login === undefined) || (password === undefined)) {
            console.log(req.body);
            return res.status(400).end()
        }
        const user = await svc.get(login)
        if (user != null) {
            return res.status(400).end()
        }
        svc.insert(login, password)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                return res.status(500).end()
            })
    })

    app.get("/useraccount/refreshtoken", jwt.validateJWT, (req, res) => {
        res.json({'id': req.user.id, 'token': jwt.generateJWT(req.user.login)})
    })
    app.get("/",(req,res)=>{
        console.log("get")
        res.json()
    })

    app.get("/useraccount/:login", async (req, res) => {
        return res.status(await svc.get(req.params.login) == null ? 404 : 200).end()
    })
}