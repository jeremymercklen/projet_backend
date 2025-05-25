module.exports = (app, animeListService, jwt) => {
    app.get("/animelist/most-viewed-genres", jwt.validateJWT, async (req, res) => {
        try {
            const userId = req.user.id; // Extraire l'ID utilisateur depuis le JWT
            const mostViewedGenres = await animeListService.dao.getMostViewedGenres(userId);
            res.json({ genres: mostViewedGenres.rows });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: "An error occurred while fetching the most viewed genres." });
        }
    })
    app.get("/animelist/:idanime", jwt.validateJWT, async (req, res) => {
        //const queryParams = new URLSearchParams(window.location.search);
        if (req.params.idanime !== undefined) {
            var response = await animeListService.dao.getByIdAnimeAndUserId(req.params.idanime, req.user.id)
            if (response.rowCount === 0) {
                return res.status(404).end()
            }
            if (response.rows[0].userid)
                response.rows[0].userid = undefined
            res.json(response.rows[0])
        }
        else
            res.json(await animeListService.dao.getAll(req.user.id))
    })
    app.get("/animelist", jwt.validateJWT, async (req, res) => {
        //const queryParams = new URLSearchParams(window.location.search);
        var animeList = (await animeListService.dao.getAllByUserId(req.user.id)).rows
        for (const anime of animeList) {
            anime.userid = undefined
        }
        res.json(animeList)
    })
    app.post("/animelist", jwt.validateJWT, (req, res) => {
        const anime = req.body
        /*if (!animeListService.isValid(anime))  {
            res.status(400).end()
            return
        }*/
        anime.userId =  req.user.id
        animeListService.dao.insert(anime)
            .then(() => res.status(200).end())
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
            if ((anime.rows[0]).userid !== req.user.id) {
                return res.status(403).end()
            }
            animeListService.dao.delete((anime.rows[0]).idanime, req.user.id)
                .then(() => res.status(200).end())
                .catch(e => {
                    console.log(e)
                    res.status(500).end()
                })
        } catch (e) {
            console.log(e)
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
        animeListService.dao.insert(anime)
            .then(() => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
    app.patch("/animelist/:idanime", jwt.validateJWT, async (req, res) => {
        const {state, nbOfEpisodesSeen, rating, isFavorite} = req.body
        if ((state !== undefined) && (nbOfEpisodesSeen !== undefined)) {
            animeListService.dao.patchStateAndNbOfEpisodesSeen(state, nbOfEpisodesSeen, req.params.idanime, req.user.id)
                .then(() => res.status(200).end())
                .catch(e => {
                    console.log(e)
                    res.status(500).end()
                })
        }
        else if ((state === undefined) && (nbOfEpisodesSeen !== undefined)) {
            animeListService.dao.patchNbOfEpisodesSeen(nbOfEpisodesSeen, req.params.idanime, req.user.id)
                .then(() => res.status(200).end())
                .catch(e => {
                    console.log(e)
                    res.status(500).end()
                })
        }
        else if ((rating !== undefined)) {
            animeListService.dao.patchRating(rating, req.params.idanime, req.user.id)
                .then(() => res.status(200).end())
                .catch(e => {
                    console.log(e)
                    res.status(500).end()
                })
        }
        else if ((isFavorite !== undefined)) {
            animeListService.dao.patchIsFavorite(isFavorite, req.params.idanime, req.user.id)
                .then(() => res.status(200).end())
                .catch(e => {
                    console.log(e)
                    res.status(500).end()
                })
        }
        else {
            res.status(400).end()
        }
    })
}
