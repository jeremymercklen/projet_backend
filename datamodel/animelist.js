module.exports = class AnimeList {
    constructor(id, idAPI, state, rating, numberOfEpisodesSeen, isFavorite, userId) {
        this.id = id
        this.idAPI = idAPI
        this.state = state
        this.rating = rating
        this.numberOfEpisodesSeen = numberOfEpisodesSeen
        this.isFavorite = isFavorite
        this.userId = userId
    }
}