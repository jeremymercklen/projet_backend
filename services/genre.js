const GenreDAO = require("../datamodel/genredao.js")

module.exports = class GenreService {
    constructor(db) {
        this.dao = new GenreDAO(db)
    }
    async insert(genre) {
        return this.dao.insert(genre)
    }
}