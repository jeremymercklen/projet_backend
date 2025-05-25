const AnimeList = require('./animelist')
const Anime = require('./anime')
const AnimeAPI = require('../services/animeapi')
const Genre = require('./genre')
const AnimeGenre = require('./animegenre')
const UserAccount = require(`./useraccount`)
const fetch = require("node-fetch")

module.exports = (animeService, userAccountService, animeListService, genreService, animeGenreService) => {
    const inserted = async () => {
        userAccountService.insert("User1", "azerty")
            .then(_ => userAccountService.dao.getByLogin("User1"))
            .then(ret => console.log(ret)); // if ret === undefined -> login absent

        const api = new AnimeAPI();
        var id = 171;
        for (var i = 0; i < 150; i++) {
            const response = await fetch(`https://api.myanimelist.net/v2/anime/${id}?fields=synopsis,num_episodes,genres`, {
                method: 'GET',
                headers: {
                    'X-MAL-CLIENT-ID': '009447f056d90a6d9fc6c220a5b207a1',
                    'content-type': 'application/json'
                }
            });
            var animeFromAPI = await response.json();
            if (!animeFromAPI.error && animeFromAPI.num_episodes > 0) {
                const anime = new Anime(i, animeFromAPI.id, animeFromAPI.title, animeFromAPI.main_picture.large, animeFromAPI.synopsis, animeFromAPI.num_episodes);
                var isInsert = await animeService.insert(anime);
                console.log(anime);
                if (isInsert === undefined) {
                    i--;
                } else {
                    const animeRes = await animeService.getByIdAPI(anime.idAPI);
                    for (const genre of animeFromAPI.genres) {
                        // Check if the genre exists
                        let genreRes = await genreService.dao.getByName(genre.name);
                        let genreId;
                        if (!genreRes.rows.length) {
                            // Insert the new genre if it doesn't exist
                            const newGenre = new Genre(genre.name);
                            const insertedGenre = await genreService.insert(newGenre);
                            genreId = insertedGenre.rows[0].id;
                        } else {
                            genreId = genreRes.rows[0].id;
                        }

                        // Insert into animeGenre table
                        const animeGenre = new AnimeGenre(animeRes.rows[0].id, genreId);
                        await animeGenreService.insert(animeGenre);
                    }
                }
            } else {
                i--;
            }
            id++;
        }
    };

    return new Promise(async (resolve, reject) => {
        try {
            await userAccountService.dao.create();
            await animeService.dao.create();
            await animeListService.dao.create();
            await genreService.dao.create();
            await animeGenreService.dao.create();
            resolve();
        } catch (e) {
            if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                resolve();
            } else {
                await inserted();
                reject(e);
            }
        }
    });
};