const BaseDAO = require('./basedao')

module.exports = class AnimeDAO extends BaseDAO {
    constructor(db) {
        super(db,"anime")
    }

    getAll() {
        return super.getAll()
    }
    create() {
        return( this.db.query("CREATE TABLE anime(id SERIAL PRIMARY KEY, idapi INT, name TEXT NOT NULL, picture TEXT NOT NULL, synopsis TEXT NOT NULL, numberofepisodes INT)"))
    }
    getByIdAPI(idAPI) {
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM anime WHERE idapi=$1`, [idAPI])
                .then(res => resolve(res))
                .catch(e => reject(e)))
    }
    getById(id) {
        return super.getById(id);
    }
    insert(anime) {
        return this.db.query("INSERT INTO anime(idapi, name, picture, synopsis, numberofepisodes) VALUES ($1,$2,$3,$4,$5)",
            [anime.idAPI, anime.name, anime.picture, anime.synopsis, anime.numberOfEpisodes])
    }
    update(anime) {
        return this.db.query("UPDATE anime SET idapi=$2,name=$3,picture=$4,synopsis=$5,numberofepisodes=$6 WHERE id=$1",
            [anime.id, anime.idAPI, anime.name, anime.picture, anime.synopsis, anime.numberOfEpisodes])
    }
    searchWithRequest(searchRequest) {
        return this.db.query(`SELECT * FROM anime WHERE LOWER(name) LIKE LOWER($1)`,
            ['%' + searchRequest + '%'])
    }
}