module.exports = (app, listService) => {
    app.get("/list", async (req, res) => {
        res.json(await listService.dao.getAll())
    })
    app.get("/list/:id", async (req, res) => {
        try {
            const list = await listService.dao.getById(req.params.id)
            if (list === undefined) {
                return res.status(404).end()
            }
            return res.json(list)
        } catch (e) { res.status(400).end() }
    })
    app.post("/list", (req, res) => {
        const list = req.body
        listService.dao.insert(list)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
    app.delete("/list/:id", async (req, res) => {
        const list = await listService.dao.getById(req.params.id)
        if (list === undefined) {
            return res.status(404).end()
        }
        listService.dao.delete(req.params.id)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
    app.put("/list", async (req, res) => {
        const list = req.body
        if ((list.id === undefined) || (list.id == null)) {
            return res.status(400).end()
        }
        if (await listService.dao.getById(list.id) === undefined) {
            return res.status(404).end()
        }
        listService.dao.update(list)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
}
