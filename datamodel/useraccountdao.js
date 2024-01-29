const BaseDAO = require('./basedao')

module.exports = class UserAccountDAO extends BaseDAO {
    constructor(db) {
        super(db, "useraccount")
    }
    insert(userAccount) {
        return this.db.query("INSERT INTO useraccount (login,challenge) VALUES ($1,$2)",
            [userAccount.login, userAccount.challenge])
    }
    create() {
        return this.db.query("CREATE TABLE useraccount(id SERIAL PRIMARY KEY, login TEXT NOT NULL, challenge TEXT NOT NULL)")
    }
    getByLogin(login) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM useraccount WHERE login=$1", [ login ])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }
}