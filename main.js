const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')

const AnimeService = require("./services/anime.js")
const UserAccountService = require("./services/useraccount.js")
const AnimeListService = require("./services/animelist.js")
const GenreService = require("./services/genre.js")
const AnimeGenreService = require("./services/animegenre.js")

require('dotenv').config();

const app = express()
app.use(bodyParser.urlencoded({extended: false})) // URLEncoded form data
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('dev')); // toutes les requêtes HTTP dans le log du serveur
app.use(cookieParser())

console.log(process.env.CONNECTION_STRING)
var dsn = process.env.CONNECTION_STRING
const port = process.env.PORT || 3333;
console.log(`Using database ${dsn}`)

const db = new pg.Pool({connectionString: dsn})
const animeService = new AnimeService(db)
const userAccountService = new UserAccountService(db)
const animeListService = new AnimeListService(db)
const genreService = new GenreService(db)
const animeGenreService = new AnimeGenreService(db)
const jwt = require('./jwt')(userAccountService)
require('./api/anime')(app, animeService, genreService, animeGenreService, jwt)
require('./api/useraccount')(app, userAccountService, jwt)
require('./api/animelist')(app, animeListService, jwt)
const seedDatabase = async () => require('./datamodel/seeder')(animeService, userAccountService, animeListService, genreService, animeGenreService)
if (require.main === module) {
    seedDatabase().then( () =>
        app.listen(port, () =>
            console.log(`Listening on the port ${port}`)
        )
    )
}
module.exports = { app, seedDatabase, userAccountService }