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
    async delete(idAnime, userId) {
        return this.dao.delete(idAnime, userId)
    }
    async patchStateAndNbOfEpisodesSeen(state, nbOfEpisodesSeen, idAnime, userId) {
        return this.dao.patchStateAndNbOfEpisodesSeen(state, nbOfEpisodesSeen, idAnime, userId)
    }
    async patchNbOfEpisodesSeen(nbOfEpisodesSeen, idAnime, userId) {
        return this.dao.patchNbOfEpisodesSeen(nbOfEpisodesSeen, idAnime, userId)
    }
    async patchRating(rating, idAnime, userId) {
        return this.dao.patchRating(rating, idAnime, userId)
    }
    async patchIsFavorite(favorite, idAnime, userId) {
        return this.dao.patchIsFavorite(favorite, idAnime, userId)
    }
}