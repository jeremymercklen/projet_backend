// services/animegenre.js
const AnimeGenreDAO = require("../datamodel/animegenredao")

module.exports = class AnimeGenreService {
    constructor(db) {
        this.dao = new AnimeGenreDAO(db)
    }

    async getAll() {
        return this.dao.getAll()
    }

    async create() {
        return this.dao.create()
    }

    async getByAnimeId(animeId) {
        return this.dao.getByAnimeId(animeId)
    }

    async getByGenreId(genreId) {
        return this.dao.getByGenreId(genreId)
    }

    async insert(animeGenre) {
        return this.dao.insert(animeGenre)
    }

    async deleteByAnimeId(animeId) {
        return this.dao.deleteByAnimeId(animeId)
    }

    async deleteByGenreId(genreId) {
        return this.dao.deleteByGenreId(genreId)
    }

    async getById(id) {
        return this.dao.getById(id)
    }

    async update(animeGenre) {
        return this.dao.update(animeGenre)
    }

    async delete(id) {
        return this.dao.delete(id)
    }
}