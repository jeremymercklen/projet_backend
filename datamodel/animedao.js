const BaseDAO = require('./basedao')

module.exports = class AnimeDAO extends BaseDAO {
    constructor(db) {
        super(db,"Anime")
    }

    getAll() {
        return super.getAll()
    }
     create() {
         return( this.db.query("CREATE TABLE anime(id SERIAL PRIMARY KEY, idAPI INT, state INT, rating INT, numberOfEpisodesSeen INT, isFavorite BOOL, userId INT)"))
    }
    insert(anime) {
        return this.db.query("INSERT INTO anime(idAPI, state, rating, numberOfEpisodesSeen, isFavorite, userId) VALUES ($1,$2,$3,$4,$5,$6)",
            [anime.idAPI, anime.state, anime.rating, anime.numberOfEpisodesSeen, anime.isFavorite, anime.userId])
        // Exemple à modifier pour récupérer le dernier ID généré avec res.rows[0].id
    }
    update(anime) {
        return this.db.query("UPDATE anime SET idAPI=$2,state=$3,rating=$4,numberOfEpisodesSeen=$5,isFavorite=$6,userId=$7 WHERE id=$1",
            [anime.id, anime.state, anime.rating, anime.rating, anime.numberOfEpisodesSeen, anime.isFavorite, anime.userId])
    }
}