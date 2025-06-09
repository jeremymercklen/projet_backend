const AnimeDAO = require("../datamodel/animedao")

module.exports = class AnimeService {
    constructor(db) {
        this.dao = new AnimeDAO(db)
    }

    // Existing methods
    async insert(anime) {
        var response = await this.dao.getByIdAPI(anime.idAPI)
        if (response.rowCount === 0) {
            return this.dao.insert(anime)
        }
    }

    async getByIdAPI(idAPI) {
        return this.dao.getByIdAPI(idAPI)
    }

    // Added CRUD methods
    async getAll() {
        return this.dao.getAll()
    }

    async create() {
        return this.dao.create()
    }

    async getById(id) {
        return this.dao.getById(id)
    }

    async update(anime) {
        return this.dao.update(anime)
    }

    async delete(id) {
        return this.dao.delete(id)
    }

    async deleteByIdAPI(id) {
        return this.dao.deleteByIdAPI(id)
    }

    async deleteById(id) {
        return this.dao.deleteById(id)
    }

    async updateById(id, anime) {
        return this.dao.updateById(id, anime)
    }
}