const List = require('./list')
const Item = require(`./item`)

module.exports = (listService, itemService) => {
    return new Promise(async (resolve, reject) => {
        try {
            let idItem = 0
            await listService.dao.create()
            await itemService.dao.create()
            for (let i = 0; i < 5; i++) {
                await listService.dao.insert(new List(i,"Shop" + i,
                    new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)),
                    true))
                for (let iItem = 0; iItem < Math.floor(Math.random() * 10); iItem++) {
                    await itemService.dao.insert(new Item(idItem, "Label" + iItem,
                        Math.floor(Math.random() * 20), true, i + 1))
                    idItem++
                }
            }
        } catch (e) {
            if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                resolve()
            } else {
                reject(e)
            }
            return
        }
    })
}