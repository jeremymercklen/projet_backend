const AnimeListDAO = require("../datamodel/animelistdao.js")

module.exports = class AnimeListService {
    constructor(db) {
        this.dao = new AnimeListDAO(db)
    }
    getByIdAnimeAndUserId(idAnime, userId) {
        return this.dao.getByIdAnimeAndUserId(idAnime, userId)
    }
    async insert(animeList) {
        return this.dao.insert(animeList)
    }

}