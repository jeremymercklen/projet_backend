module.exports = class AnimeList {
    constructor(idAnime, state, rating, numberOfEpisodesSeen, isFavorite, userId) {
        this.idAnime = idAnime
        this.state = state
        this.rating = rating
        this.numberOfEpisodesSeen = numberOfEpisodesSeen
        this.isFavorite = isFavorite
        this.userId = userId
    }
}