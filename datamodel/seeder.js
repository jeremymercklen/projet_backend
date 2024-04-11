const Anime = require('./animelist')
const UserAccount = require(`./useraccount`)

module.exports = (animeService, userAccountService) => {
    const inserted=()=>{
        userAccountService.insert("User1", "azerty")
            .then(_ => userAccountService.dao.getByLogin("user1@example.com"))
            .then(ret=>console.log(ret))//if ret===undefined -> login absent


    }
    return new Promise(async (resolve, reject) => {
        try {
            await animeService.dao.create()
            await userAccountService.dao.create()
            inserted()
            resolve()
        } catch (e) {
            if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                inserted()
                resolve()
            } else {
                reject(e)
            }
            return
        }
    })
}