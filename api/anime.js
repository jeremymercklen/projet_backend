const fetch = require("node-fetch");
const Anime = require("../datamodel/anime");
const Genre = require("../datamodel/genre");
module.exports = (app, animeService, genreService, jwt) => {
    app.get("/anime", jwt.validateJWT, async (req, res) => {
        try {
            var response
            if (req.query.genre !== undefined && req.query.id === undefined) {
                response = await genreService.dao.getByGenre(req.query.genre)
                var animes = [];
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
                var anime = response.rows[0]
                if (anime === undefined) {
                    return res.status(404).end()
                }
                response = await genreService.dao.getByIdAnime(anime.id)
                anime.genres = response.rows
                res.json({info: anime})
            }
        } catch (e) {
            console.log(e)
            res.status(400).end()
        }
    })
    app.get("/anime/fill/:startId", jwt.validateJWT, async (req, res) => {
        try {
            var id = parseInt(req.params.startId)
            for (var i = 0; i < 50; i++) {
                const response = await fetch(`https://api.myanimelist.net/v2/anime/${id}?fields=synopsis,num_episodes,genres`, {
                    method: 'GET',
                    headers: {
                        'X-MAL-CLIENT-ID': '009447f056d90a6d9fc6c220a5b207a1',
                        'content-type': 'application/json'
                    }
                })
                var animeFromAPI = await response.json()
                if (!animeFromAPI.error && animeFromAPI.num_episodes > 0) {
                    var anime = new Anime(i, animeFromAPI.id, animeFromAPI.title, animeFromAPI.main_picture.large, animeFromAPI.synopsis, animeFromAPI.num_episodes)
                    var isInsert = await animeService.insert(anime)
                    console.log(anime)
                    if (isInsert === undefined)
                        i--
                    else {
                        var genreResponse = await animeService.getByIdAPI(anime.idAPI)
                        for (const genre of animeFromAPI.genres) {
                            var newGenre = new Genre(i, genreResponse.rows[0].id, genre.name)
                            await genreService.insert(newGenre)
                        }
                    }
                } else
                    i--
                id++
                //await new Promise(r => setTimeout(r, 2000));
            }
            res.status(200).end()
        } catch (e) {
            console.log(e)
            res.status(400).end()
        }
    })
    app.get("/anime/search/:searchRequest", jwt.validateJWT, async (req, res) => {
        try {
            if (req.params.searchRequest !== undefined) {
                const response = await animeService.dao.searchWithRequest(req.params.searchRequest);
                var animes = []
                var i = 0
                for (const responseElement of response.rows) {
                    animes.push(responseElement)
                    animes[i].genres = (await genreService.dao.getByIdAnime(responseElement.idapi)).rows
                    i++
                }
                if (animes.length !== 0) {
                    res.json({infos: animes})
                } else {
                    res.status(404).end()
                }
            }
        } catch (e) {
            console.log(e)
            res.status(400).end()
        }
    })
}