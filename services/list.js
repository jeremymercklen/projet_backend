const ListDAO = require("../datamodel/listDAO")

module.exports = class ListService {
    constructor(db) {
        this.dao = new ListDAO(db)
    }
}