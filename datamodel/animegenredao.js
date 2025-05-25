const BaseDAO = require('./basedao')

module.exports = class AnimeGenreDAO extends BaseDAO {
    constructor(db) {
        super(db, "animegenre");
    }

    getAll() {
        return super.getAll();
    }

    create() {
        return this.db.query("CREATE TABLE animegenre(id SERIAL PRIMARY KEY, idanime INT REFERENCES anime (id), idgenre INT REFERENCES genre (id))");
    }

    getByAnimeId(animeId) {
        return new Promise((resolve, reject) =>
            this.db.query(`
                SELECT ag.id, ag.idanime, ag.idgenre
                FROM animegenre ag
                WHERE ag.idanime = $1`, [animeId])
                .then(res => resolve(res.rows))
                .catch(e => reject(e))
        );
    }

    getByGenreId(genreId) {
        return new Promise((resolve, reject) =>
            this.db.query(`
                SELECT ag.id, ag.idanime, ag.idgenre
                FROM animegenre ag
                WHERE ag.idgenre = $1`, [genreId])
                .then(res => resolve(res.rows))
                .catch(e => reject(e))
        );
    }

    insert(animeGenre) {
        return this.db.query("INSERT INTO animegenre(idanime, idgenre) VALUES ($1, $2) RETURNING id", [animeGenre.idAnime, animeGenre.idGenre]);
    }

    deleteByAnimeId(animeId) {
        return this.db.query("DELETE FROM animegenre WHERE idanime = $1", [animeId]);
    }

    deleteByGenreId(genreId) {
        return this.db.query("DELETE FROM animegenre WHERE idgenre = $1", [genreId]);
    }
}