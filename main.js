const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const ListService = require("./services/list")
const ItemService = require("./services/item")

const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // URLEncoded form data
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('dev')); // toutes les requêtes HTTP dans le log du serveur

//const connectionString = "postgres://user:password@192.168.56.101/instance"
const connectionString = "postgres://tp_sql_user:azerty@localhost/tp_sql"
const db = new pg.Pool({ connectionString: connectionString })
const listService = new ListService(db)
const itemService = new ItemService(db)
require('./api/list')(app, listService)
require('./api/item')(app, itemService, listService)
require('./datamodel/seeder')(listService, itemService)
    .then(app.listen(3333))


