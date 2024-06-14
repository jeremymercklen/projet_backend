const bcrypt = require('bcrypt')
const UserAccountDAO = require('../datamodel/useraccountdao')
const UserAccount = require('../datamodel/useraccount')

module.exports = class UserAccountService {
    constructor(db) {
        this.dao = new UserAccountDAO(db)
    }
    hashPassword(password) {
        return bcrypt.hashSync(password, 10)  // 10 : cost factor -> + élevé = hash + sûr
    }
    async insert(login, password) {
        var response = await this.get(login)
        if (response === undefined)
            return this.dao.insert(new UserAccount(login, this.hashPassword(password)))
    }
    get(login) {
        return this.dao.getByLogin(login)
    }
    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash)
    }
    async validatePassword(login, password) {
        const user = await this.dao.getByLogin(login.trim())
        if ((user != null) && this.comparePassword(password, user.challenge)) {
            return user;
        }
        return null;
    }
}