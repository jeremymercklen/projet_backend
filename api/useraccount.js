module.exports = (app, svc, jwt) => {
    app.post('/useraccount/authenticate', (req, res) => {
        const { login, password } = req.body
        if ((login === undefined) || (password === undefined)) {
            res.status(400).end()
            return
        }
        svc.validatePassword(login, password)
            .then(authenticated => {
                if (!authenticated) {
                    res.status(401).end()
                    return
                }
                res.json({'login':login, 'token': jwt.generateJWT(login)})
            })
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
    app.post('/useraccount', async (req, res) => {
        const { login, password } = req.body
        if ((login === undefined) || (password === undefined)) {
            res.status(400).end()
            return
        }
        let isLogin = await svc.dao.getByLogin(login)
        svc.insert(login, password).then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
    app.get('/useraccount/:login', async (req, res) => {
        try {
            const userAccount = await svc.dao.getByLogin(req.params.login)
            if (userAccount === undefined) {
                return res.status(404).end()
            }
            return res.json(userAccount)
        } catch (e) { res.status(400).end() }
    })
}