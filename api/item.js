module.exports = (app, itemService, listService) => {
    app.get("/item", async (req, res) => {
        res.json(await itemService.dao.getAll())
    })

    app.get("/itemByIdList/:idList", async (req, res) => {
        try {
            const list = await listService.dao.getById(req.params.idList)
            if (list === undefined) {
                return res.status(404).end()
            }
            return res.json(await itemService.dao.getItemByIdList(req.params.idList))
        } catch (e) { res.status(400).end() }
    })
    app.get("/item/:id", async (req, res) => {
        try {
            const item = await itemService.dao.getById(req.params.id)
            if (item === undefined) {
                return res.status(404).end()
            }
            return res.json(item)
        } catch (e) { res.status(400).end() }
    })
    app.post("/item", (req, res) => {
        const item = req.body
        itemService.dao.insert(item)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
    app.delete("/item/:id", async (req, res) => {
        const item = await itemService.dao.getById(req.params.id)
        if (item === undefined) {
            return res.status(404).end()
        }
        itemService.dao.delete(req.params.id)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
    app.put("/item", async (req, res) => {
        const item = req.body
        if ((item.id === undefined) || (item.id == null)) {
            return res.status(400).end()
        }
        if (await itemService.dao.getById(item.id) === undefined) {
            return res.status(404).end()
        }
        itemService.dao.update(item)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
}