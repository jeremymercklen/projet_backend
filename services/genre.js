const GenreDAO = require("../datamodel/genredao")

module.exports = class GenreService {
    constructor(db) {
        this.dao = new GenreDAO(db)
    }

    async getAll() {
        return this.dao.getAll()
    }

    async create() {
        return this.dao.create()
    }

    async getById(id) {
        return this.dao.getById(id)
    }

    async getByGenre(name) {
        return this.dao.getByGenre(name)
    }

    async getByName(name) {
        return this.dao.getByName(name)
    }

    async insert(genre) {
        return this.dao.insert(genre)
    }

    async update(genre) {
        return this.dao.update(genre)
    }

    async getByIdAnime(animeId) {
        if (!animeId) {
            throw new Error("Anime ID is required");
        }
        return this.dao.getByIdAnime(animeId);
    }
}