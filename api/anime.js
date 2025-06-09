const fetch = require("node-fetch");
const Anime = require("../datamodel/anime");
const Genre = require("../datamodel/genre");
const AnimeGenre = require("../datamodel/animegenre");
module.exports = (app, animeService, genreService, animeGenreService, jwt) => {
    app.get("/anime", jwt.validateJWT, async (req, res) => {
        try {
            if (req.query.id !== undefined) {
                // Handle fetching anime by ID
                const animeResponse = await animeService.dao.getById(req.query.id);
                if (animeResponse.rowCount === 0) {
                    return res.status(404).json({ error: "Anime not found." });
                }

                const anime = animeResponse.rows[0];
                anime.genres = (await genreService.dao.getByIdAnime(anime.id)).rows;

                return res.json(anime);
            }
            else {
                return res.status(400).json({ error: "Invalid query parameters." });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: "An error occurred while processing the request." });
        }
    })
    app.get("/anime/:genre", jwt.validateJWT, async (req, res) => {
        try {
            const genre = req.params.genre;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const countResult = await genreService.dao.getAnimeCountByGenre(genre);
            const totalAnimes = parseInt(countResult.rows[0].total);

            if (totalAnimes === 0) {
                return res.status(404).json({ error: "No animes found for the specified genre." });
            }

            const response = await genreService.dao.getByGenre(genre, limit, offset);
            const animes = [];

            for (const anime of response.rows) {
                anime.genres = (await genreService.dao.getByIdAnime(anime.id)).rows;
                animes.push(anime);
            }

            return res.json({
                infos: animes,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalAnimes / limit),
                    totalItems: totalAnimes,
                    itemsPerPage: limit
                }
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: "An error occurred while processing the request." });
        }
    });
    app.get("/anime/fill/:startId", jwt.validateJWT, async (req, res) => {
        try {
            var id = parseInt(req.params.startId);
            const count = parseInt(req.query.count) || 50;
            for (var i = 0; i < count; i++) {
                const response = await fetch(`https://api.myanimelist.net/v2/anime/${id}?fields=synopsis,num_episodes,genres`, {
                    method: 'GET',
                    headers: {
                        'X-MAL-CLIENT-ID': 'f039610d88e56707c0e9ea6d105f900f',
                        'content-type': 'application/json'
                    }
                });
                var animeFromAPI = await response.json();
                if (!animeFromAPI.error && animeFromAPI.num_episodes > 0) {
                    var anime = new Anime(i, animeFromAPI.id, animeFromAPI.title, animeFromAPI.main_picture.large, animeFromAPI.synopsis, animeFromAPI.num_episodes);
                    var isInsert = await animeService.insert(anime);
                    console.log(anime);
                    if (isInsert === undefined) {
                        i--;
                    } else {
                        var animeRes = await animeService.getByIdAPI(anime.idAPI);
                        for (const genre of animeFromAPI.genres) {
                            const existingGenre = await genreService.getByName(genre.name);
                            let genreId;
                            if (!existingGenre.rowCount) {
                                var newGenre = new Genre(genre.name);
                                const insertedGenre = await genreService.insert(newGenre);
                                genreId = insertedGenre.rows[0].id;
                            } else {
                                genreId = existingGenre.rows[0].id;
                            }

                            const newAnimeGenre = new AnimeGenre(animeRes.rows[0].id, genreId);
                            await animeGenreService.insert(newAnimeGenre);
                        }
                    }
                    id++;
                }
                // If the anime is invalid or has an error, we don't increment i to retry with the same ID
            }
            res.status(200).end();
        } catch (e) {
            console.log(e);
            res.status(400).end();
        }
    })
    app.get("/anime/search/:searchRequest", jwt.validateJWT, async (req, res) => {
        try {
            if (req.params.searchRequest !== undefined) {
                const response = await animeService.dao.searchWithRequest(req.params.searchRequest);
                var animes = [];
                for (const responseElement of response.rows) {
                    const anime = responseElement;
                    anime.genres = (await genreService.dao.getByIdAnime(responseElement.id)).rows; // Correction ici
                    animes.push(anime);
                }
                if (animes.length !== 0) {
                    res.json({ infos: animes });
                } else {
                    res.status(404).end();
                }
            }
        } catch (e) {
            console.log(e);
            res.status(400).end();
        }
    })

}