const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')

const AnimeService = require("./services/animelist.js")
const UserAccountService = require("./services/useraccount.js")

const app = express()
app.use(bodyParser.urlencoded({extended: false})) // URLEncoded form data
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('dev')); // toutes les requêtes HTTP dans le log du serveur
app.use(cookieParser())

const dsn = process.env.CONNECTION_STRING
const port = process.env.PORT || 3333;
console.log(`Using database ${dsn}`)
const db = new pg.Pool({connectionString: dsn})
const animeService = new AnimeService(db)
const userAccountService = new UserAccountService(db)
const jwt = require('./jwt')(userAccountService)
require('./api/animelist')(app, animeService, jwt)
require('./api/useraccount')(app, userAccountService, jwt)
require('./datamodel/seeder')(animeService, userAccountService)
    .then(app.listen(port, () =>
        console.log(`Listening on the port ${port}`)))


