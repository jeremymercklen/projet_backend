const BaseDAO = require('./basedao')

module.exports = class AnimeListDAO extends BaseDAO {
    constructor(db) {
        super(db,"animelist")
    }

    getAll() {
        return super.getAll()
    }
    getAllByUserId(userId) {
        return( this.db.query("SELECT * FROM animelist WHERE userid=$1 ORDER BY state", [userId]) )
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
            [parseInt(animelist.id), animelist.idAnime, parseInt(animelist.state), parseInt(animelist.rating), parseInt(animelist.numberOfEpisodesSeen), animelist.isFavorite, parseInt(animelist.userId)])
    }
    getByIdAnimeAndUserId(idAnime, userId) {
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM animelist WHERE (idanime=$1 AND userid=$2)`, [idAnime, userId])
                .then(res => resolve(res))
                .catch(e => reject(e)))
    }
    delete(idAnime, userId) {
        return new Promise((resolve, reject) =>
            this.db.query(`DELETE FROM animelist WHERE (idanime=$1 AND userid=$2)`, [idAnime, userId])
                .then(res => resolve(res))
                .catch(e => reject(e)))
    }
    patchStateAndNbOfEpisodesSeen(state, nbOfEpisodesSeen, idAnime, userId) {
        return this.db.query(`UPDATE animelist SET state=$1, numberofepisodesseen=$2 WHERE (idanime=$3 AND userid=$4)`,
            [state, nbOfEpisodesSeen, idAnime, userId])
    }
    patchNbOfEpisodesSeen(nbOfEpisodesSeen, idAnime, userId) {
        return this.db.query(`UPDATE animelist SET numberofepisodesseen=$1 WHERE (idanime=$2 AND userid=$3)`,
            [nbOfEpisodesSeen, idAnime, userId])
    }
    patchRating(rating, idAnime, userId) {
        return this.db.query(`UPDATE animelist SET rating=$1 WHERE (idanime=$2 AND userid=$3)`,
            [rating, idAnime, userId])
    }
    patchIsFavorite(isFavorite, idAnime, userId) {
        return this.db.query(`UPDATE animelist SET isfavorite=$1 WHERE (idanime=$2 AND userid=$3)`,
            [isFavorite, idAnime, userId])
    }
}