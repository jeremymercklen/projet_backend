const BaseDAO = require('./basedao')

module.exports = class ListDAO extends BaseDAO {
    constructor(db) {
        super(db,"List")
    }

    getAll() {
        return super.getAll()
    }
    create() {
        return this.db.query("CREATE TABLE List(id SERIAL PRIMARY KEY, shop TEXT, date DATE, archived BOOL)")
    }
    insert(list) {
        return this.db.query("INSERT INTO list(shop,date,archived) VALUES ($1,$2,$3)",
            [list.shop, list.date, list.archived])
        // Exemple à modifier pour récupérer le dernier ID généré avec res.rows[0].id
    }
    update(list) {
        return this.db.query("UPDATE list SET shop=$2,date=$3,archived=$4 WHERE id=$1",
            [list.id, list.shop, list.date, list.archived])
    }
}