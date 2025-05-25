const BaseDAO = require('./basedao')

module.exports = class GenreDAO extends BaseDAO {
    constructor(db) {
        super(db, "genre");
    }

    getAll() {
        return super.getAll();
    }

    create() {
        return this.db.query("CREATE TABLE genre(id SERIAL PRIMARY KEY, name TEXT NOT NULL)");
    }

    getById(id) {
        return super.getById(id);
    }

    getByIdAnime(animeId) {
        return this.db.query(`
        SELECT g.* 
        FROM genre g
        JOIN animegenre ag ON g.id = ag.idgenre
        WHERE ag.idanime = $1
    `, [animeId]);
    }

    getByGenre(genre, limit = 10, offset = 0) {
        return this.db.query(`
            SELECT DISTINCT a.*
            FROM anime a
            JOIN animegenre ag ON a.id = ag.idanime
            JOIN genre g ON ag.idgenre = g.id
            WHERE g.name = $1
            ORDER BY a.id
            LIMIT $2 OFFSET $3
        `, [genre, limit, offset]);
    }

    getAnimeCountByGenre(genre) {
        return this.db.query(`
            SELECT COUNT(DISTINCT a.id) as total
            FROM anime a
            JOIN animegenre ag ON a.id = ag.idanime
            JOIN genre g ON ag.idgenre = g.id
            WHERE g.name = $1
        `, [genre]);
    }

    async getByName(name) {
        return this.db.query("SELECT * FROM genre WHERE LOWER(name) = $1", [name.toLowerCase()])
    }

    insert(genre) {
        return this.db.query("INSERT INTO genre(name) VALUES ($1) RETURNING id", [genre.name.toLowerCase()]);
    }

    update(genre) {
        return this.db.query("UPDATE genre SET name = $2 WHERE id = $1", [genre.id, genre.name]);
    }
}