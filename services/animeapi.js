const serviceBaseUrl = "https://api.myanimelist.net/v2/anime"

function fetchJSON(url, token) {
    const headers = new Headers();
    if (token !== undefined) {
        headers.append("Authorization", `Bearer ${token}`)
    }
    return new Promise((resolve, reject) => fetch(url, {cache: "no-cache", headers: headers})
        .then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
        })
        .catch(err => reject(err)))
}
module.exports = class AnimeAPI {
    get(id) {
        return fetchJSON(`${serviceBaseUrl}/${id}?fields=synopsis,num_episodes,genres`, '009447f056d90a6d9fc6c220a5b207a1')
    }
}
