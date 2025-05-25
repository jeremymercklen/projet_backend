const AnimeListDAO = require("../datamodel/animelistdao")

module.exports = class AnimeListService {
    constructor(db) {
        this.dao = new AnimeListDAO(db)
    }

    async getAll() {
        return this.dao.getAll()
    }

    async getAllByUserId(userId) {
        return this.dao.getAllByUserId(userId)
    }

    async create() {
        return this.dao.create()
    }

    async insert(animelist) {
        return this.dao.insert(animelist)
    }

    async update(animelist) {
        return this.dao.update(animelist)
    }

    async getByIdAnimeAndUserId(idAnime, userId) {
        return this.dao.getByIdAnimeAndUserId(idAnime, userId)
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

    async patchIsFavorite(isFavorite, idAnime, userId) {
        return this.dao.patchIsFavorite(isFavorite, idAnime, userId)
    }
    async getMostViewedGenres(userId) {
        return this.dao.getMostViewedGenres(userId)
    }
}