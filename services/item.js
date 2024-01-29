const ItemDAO = require("../datamodel/itemDAO")

module.exports = class ItemService {
    constructor(db) {
        this.dao = new ItemDAO(db)
    }
}