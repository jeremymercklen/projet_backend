module.exports = (app, animeListService, jwt) => {
    app.get("/animelist/:idanime", jwt.validateJWT, async (req, res) => {
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.has('idanime')) {
        res.json(await animeListService.dao.getByIdAnimeAndUserId(queryParams.get('idanime'), req.user.id));
        }
        else
            res.json(await animeListService.dao.getAll(req.user))
    })
    app.post("/animelist", jwt.validateJWT, (req, res) => {
        const anime = req.body
        if (!animeListService.isValid(anime))  {
            res.status(400).end()
            return
        }
        anime.userid =  req.user.id
        animeListService.dao.insert(anime)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
    app.delete("/animelist/:idanime", jwt.validateJWT, async (req, res) => {
        try {
            const anime = await animeListService.dao.getByIdAnimeAndUserId(req.params.idanime, req.user.id)
            if (anime === undefined) {
                return res.status(404).end()
            }
            if (anime.userid !== req.user.id) {
                return res.status(403).end()
            }
            animeListService.dao.delete(anime.id)
                .then(_ => res.status(200).end())
                .catch(e => {
                    console.log(e)
                    res.status(500).end()
                })
        } catch (e) {
            res.status(400).end()
        }
    })
    app.put("/animelist", jwt.validateJWT, async (req, res) => {
        const anime = req.body
        if ((anime.id === undefined) || (anime.id == null) /*|| (!svc.isValid(anime))*/) {
            return res.status(400).end()
        }
        const prevAnime = await animeListService.dao.getById(anime.id)
        if (prevAnime === undefined) {
            return res.status(404).end()
        }
        animeListService.dao.update(anime)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
        app.patch("/animelist/:idanime", jwt.validateJWT, async (req, res) => {
            const {state, nbOfEpisodesSeen} = req.body
            if ((state === undefined) || (nbOfEpisodesSeen === undefined)) {
                return res.status(400).end()
            }

        })
    })
}
