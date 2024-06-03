module.exports = (app, animeService, genreService, jwt) => {
    app.get("/anime", jwt.validateJWT, async (req, res) => {
        try {
            var response
            if (req.query.genre !== undefined && req.query.id === undefined) {
                response = await genreService.dao.getByGenre(req.query.genre)
                var animes = []
                var genres = []
                var i = 0
                for (const responseElement of response.rows) {
                    animes.push((await animeService.dao.getById(responseElement.idanime)).rows[0])
                    animes[i].genres = (await genreService.dao.getByIdAnime(responseElement.idanime)).rows
                    i++
                }
                res.json({infos: animes})
            }
            if (req.query.id !== undefined && req.query.genre === undefined) {
                response = await animeService.dao.getById(parseInt(req.query.id))
                anime = response.rows[0]
                if (anime === undefined) {
                    return res.status(404).end()
                }
                response = await genreService.dao.getByIdAnime(anime.id)
                anime.genres = response.rows
                res.json({info: anime})
            }
        } catch (e) {
            res.status(400).end()
        }
    })
}