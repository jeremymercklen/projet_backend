const BaseDAO = require('./basedao')

module.exports = class AnimeListDAO extends BaseDAO {
    constructor(db) {
        super(db,"animelist")
    }

    getAll() {
        return super.getAll()
    }
     create() {
         return( this.db.query("CREATE TABLE animelist(id SERIAL PRIMARY KEY, idanime INT REFERENCES Anime (id), state INT, rating INT, numberofepisodesseen INT, isfavorite BOOL, userid INT REFERENCES useraccount (id))"))
    }
    insert(animelist) {
        return this.db.query("INSERT INTO animelist(idanime, state, rating, numberofepisodesseen, isfavorite, userid) VALUES ($1,$2,$3,$4,$5,$6)",
            [animelist.idAnime, animelist.state, animelist.rating, animelist.numberOfEpisodesSeen, animelist.isFavorite, animelist.userId])
        // Exemple à modifier pour récupérer le dernier ID généré avec res.rows[0].id
    }
    update(animelist) {
        return this.db.query("UPDATE animelist SET idanime=$2,state=$3,rating=$4,numberofepisodesseen=$5,isfavorite=$6,userid=$7 WHERE id=$1",
            [animelist.id, animelist.idAnime, animelist.state, animelist.rating, animelist.rating, animelist.numberOfEpisodesSeen, animelist.isFavorite, animelist.userId])
    }
    getByIdAnimeAndUserId(idAnime, userId) {
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM animelist WHERE (idanime=$1 AND userid=$2)`, [idAnime, userId])
                .then(res => resolve(res))
                .catch(e => reject(e)))
    }
}