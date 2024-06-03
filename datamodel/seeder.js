const AnimeList = require('./animelist')
const Anime = require('./anime')
const AnimeAPI = require('../services/animeapi')
const Genre = require('./genre')
const UserAccount = require(`./useraccount`)
const fetch = require("node-fetch")

module.exports = (animeService, userAccountService, animeListService, genreService) => {
    const inserted = async ()=>{
        userAccountService.insert("User1", "azerty")
            .then(_ => userAccountService.dao.getByLogin("User1"))
            .then(ret=>console.log(ret))//if ret===undefined -> login absent
        const api = new AnimeAPI()
        var id = 171
        for (var i = 0; i < 150; i++) {
            const response = await fetch(`https://api.myanimelist.net/v2/anime/${id}?fields=synopsis,num_episodes,genres`, {
                method: 'GET',
                headers: {
                    'X-MAL-CLIENT-ID': '009447f056d90a6d9fc6c220a5b207a1',
                    'content-type': 'application/json'
                }
            })
            var animeFromAPI = await response.json()
            if (!animeFromAPI.error) {
                anime = new Anime(i, animeFromAPI.id, animeFromAPI.title, animeFromAPI.main_picture.large, animeFromAPI.synopsis, animeFromAPI.num_episodes)
                var isInsert = await animeService.insert(anime)
                console.log(anime)
                if (isInsert === undefined)
                    i--
                else {
                    var res = await animeService.getByIdAPI(anime.idAPI)
                    for (const genre of animeFromAPI.genres) {
                        var newGenre = new Genre(i, res.rows[0].id, genre.name)
                        await genreService.insert(newGenre)
                    }

                }
            } else
                i--
            id++
            //await new Promise(r => setTimeout(r, 2000));
        }
    }
    return new Promise(async (resolve, reject) => {
        try {
            await userAccountService.dao.create()
            await animeService.dao.create()
            await animeListService.dao.create()
            await genreService.dao.create()
            resolve()
        } catch (e) {
            if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                resolve()
                //inserted()
            } else {
                inserted()
                reject(e)
            }
            return
        }
    })
}