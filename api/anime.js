module.exports = (app, animeService, jwt) => {
    app.get("/anime", jwt.validateJWT, async (req, res) => {
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.has('id') && queryParams.has('idapi')) {
            res.json(await animeService.dao.getByIdAPI(queryParams.get('id'), queryParams.get('idapi')));
        }
        else
            res.json(await animeService.dao.getAll(req.user))
    })
    app.post("/anime", jwt.validateJWT, (req, res) => {
        const anime = req.body
        if (!animeService.isValid(anime))  {
            res.status(400).end()
            return
        }
        anime.useraccount_id = req.user.id
        animeService.dao.insert(anime)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
    app.delete("/anime/:id", jwt.validateJWT, async (req, res) => {
        try {
            const anime = await animeService.dao.getById(req.params.id)
            if (anime === undefined) {
                return res.status(404).end()
            }
            if (anime.useraccount_id !== req.user.id) {
                return res.status(403).end()
            }
            animeService.dao.delete(req.params.id)
                .then(_ => res.status(200).end())
                .catch(e => {
                    console.log(e)
                    res.status(500).end()
                })
        } catch (e) {
            res.status(400).end()
        }
    })
    app.put("/anime", jwt.validateJWT, async (req, res) => {
        const anime = req.body
        if ((anime.id === undefined) || (anime.id == null) || (!svc.isValid(anime))) {
            return res.status(400).end()
        }
        const prevAnime = await svc.dao.getById(anime.id)
        if (prevAnime === undefined) {
            return res.status(404).end()
        }
        if (prevAnime.useraccount_id !== req.user.id) {
            return res.status(403).end()
        }
        animeService.dao.update(anime)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
}
