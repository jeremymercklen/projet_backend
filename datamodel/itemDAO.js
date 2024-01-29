const BaseDAO = require("./basedao");
module.exports = class ItemDAO extends BaseDAO {
    constructor(db) {
        super(db,"Item")
    }

    getAll() {
        return super.getAll()
    }
    async getItemByIdList(idList) {
        return new Promise((resolve, reject) =>
            this.db.query('SELECT * FROM Item WHERE idList=$1', [idList])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    create() {
        return this.db.query("CREATE TABLE Item(id SERIAL PRIMARY KEY, label TEXT, quantity INT, checked BOOL, idList INT)")
    }

    insert(item) {
        return this.db.query("INSERT INTO item(label,quantity,checked,idList) VALUES ($1,$2,$3,$4)",
            [item.label, item.quantity, item.checked, item.idList])
        // Exemple à modifier pour récupérer le dernier ID généré avec res.rows[0].id
    }
    update(item) {
        return this.db.query("UPDATE item SET label=$2,quantity=$3,checked=$4,idlist=$5 WHERE id=$1",
            [item.id, item.label, item.quantity, item.checked, item.idlist])
    }
}