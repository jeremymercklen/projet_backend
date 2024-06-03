const AnimeDAO = require("../datamodel/animedao")

module.exports = class AnimeService {
    constructor(db) {
        this.dao = new AnimeDAO(db)
    }
    async insert(anime) {
        var response = await this.dao.getByIdAPI(anime.idAPI)
        if (response.rowCount === 0) {
            return this.dao.insert(anime)
        }
    }
    async getByIdAPI(idAPI) {
        return this.dao.getByIdAPI(idAPI)
    }
}