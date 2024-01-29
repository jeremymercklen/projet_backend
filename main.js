const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // URLEncoded form data
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('dev')); // toutes les requêtes HTTP dans le log du serveur

//const connectionString = "postgres://user:password@192.168.56.101/instance"
const connectionString = "postgres://tp_sql_user:azerty@localhost:5432/tp_sql"
const db = new pg.Pool({ connectionString: connectionString })
const animeService = new AnimeService(db)
const userAccountService = new UserAccountService(db)
const jwt = require('./jwt')(userAccountService)
require('./api/anime')(app, animeService, jwt)
require('./api/useraccount')(app, userAccountService, jwt)
require('./datamodel/seeder')(animeService, userAccountService)
     .then(app.listen(3333))


