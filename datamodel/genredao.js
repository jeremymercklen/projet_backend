const BaseDAO = require('./basedao')

module.exports = class GenreDAO extends BaseDAO {
    constructor(db) {
        super(db,"anime")
    }

    getAll() {
        return super.getAll()
    }
    create() {
        return( this.db.query("CREATE TABLE genre(id SERIAL PRIMARY KEY, idanime INT REFERENCES anime (id), name TEXT NOT NULL)"))
    }
    getById(id) {
        return super.getById(id);
    }
    getByIdAnime(idAnime) {
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT name FROM genre WHERE idanime=$1`, [idAnime])
                .then(res => resolve(res))
                .catch(e => reject(e)))
    }
    getByGenre(name){
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM genre WHERE name=$1`, [name.toLowerCase()])
                .then(res => resolve(res))
                .catch(e => reject(e)))
    }
    insert(anime) {
        return this.db.query("INSERT INTO genre(idanime, name) VALUES ($1,$2)",
            [anime.idAnime, anime.name.toLowerCase()])
    }
    update(anime) {
        return this.db.query("UPDATE genre SET idanime=$2,name=$3 WHERE id=$1",
            [anime.id, anime.idAnime, anime.name])
    }
}