module.exports = class Anime {
    constructor(id, idAPI, name, picture, synopsis, numberOfEpisodes) {
        this.id = id
        this.idAPI = idAPI
        this.name = name
        this.picture = picture
        this.synopsis = synopsis
        this.numberOfEpisodes = numberOfEpisodes
    }
}