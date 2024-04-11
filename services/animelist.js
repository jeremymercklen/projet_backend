const AnimeDAO = require("../datamodel/animedao")

module.exports = class AnimeListService {
    constructor(db) {
        this.dao = new AnimeDAO(db)
    }
}