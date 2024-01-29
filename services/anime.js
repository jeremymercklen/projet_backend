const AnimeDAO = require("../datamodel/animedao")

module.exports = class AnimeService {
    constructor(db) {
        this.dao = new AnimeDAO(db)
    }
}