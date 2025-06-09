const chai = require('chai')
const chaiHttp = require('chai-http');
const { app, seedDatabase, userAccountService, animeService, genreService, animeListService, animeGenreService} = require("../main");
const {expect} = require("chai");
const AnimeList = require("../datamodel/animelist");
const {decode} = require("jsonwebtoken");
const should = chai.should();

chai.use(chaiHttp);

describe('API Tests', function() {
    this.timeout(5000);
    let token = '';
    let idAnime = 0;
    let userId = 0;
    let genreId = 0;

    // Connexion à l'API pour récupérer le token JWT
    before( (done) => {
        seedDatabase().then( async () => {
            console.log("Creating test user");
            // Création d'un utilisateur de test
            userAccountService.insert('user1', 'default').then( () =>
                chai.request(app)
                    .post('/useraccount/authenticate')
                    .send({login: 'user1', password: 'default'})
                    .end((err, res) => {
                        res.should.have.status(200);
                        token = res.body.token;
                        const decodedToken = decode(token);
                        userId = decodedToken.id;
                        done();
                    })
            );

            // Création d'un anime de test
            console.log("Creating test anime");
            const anime = {
                idAPI: 99999999,
                name: 'Test Anime',
                picture: 'http://example.com/image.jpg',
                synopsis: 'This is a test anime.',
                numberOfEpisodes: 12
            };
            await animeService.insert(anime);
            const resultAnime = await animeService.getByIdAPI(anime.idAPI);
            idAnime = resultAnime.rows[0].id;

            // Création d'un genre de test
            console.log("Creating test genre");
            const genre = {
                name: 'Test Genre'
            };
            const resultGenre = await genreService.insert(genre);
            genreId = resultGenre.rows[0].id;

            // Association de l'anime au genre
            console.log("Associating anime with genre");
            await animeGenreService.insert(idAnime, genre.name);
            console.log("Test setup complete");
        })
    });

    // Suppression des données de tests à la fin de ceux-ci
    after((done) => {
        console.log("Cleaning up test data");
        Promise.all([
            // First delete anime list entries
            animeListService.dao.delete(idAnime, userId)
                .then(() => {
                    console.log("Anime list entries deleted");
                    // Then delete the user
                    userAccountService.get('user1').then(user => {
                        if (user) return userAccountService.dao.delete(user.id);
                    });

                    animeGenreService.deleteByAnimeId(idAnime).then(() => {
                        animeService.deleteById(idAnime);
                        genreService.delete(genreId)
                    });
                }),
        ]).then(() => done())
            .catch(err => {
                console.error("Cleanup error:", err);
                done(err);
            });
    });

    // Test avec un token JWT valide
    it('should allow access with valid token', (done) => {
        chai.request(app)
            .get('/useraccount/refreshtoken')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                //res.body.should.have.lengthOf(0);
                done();
            });
    });

    // Test avec un token JWT non valide
    it('should deny access with invalid token', (done) => {
        chai.request(app)
            .get('/animelist')
            .set('Authorization', 'Bearer wrongtoken')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    // Test de la recherche d'anime
    it('should find test anime in search', (done) => {
        chai.request(app)
            .get('/anime/search/Test Anime')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('infos');
                res.body.infos.should.be.a('array');
                res.body.infos[0].should.have.property('name').eql('Test Anime');
                done();
            });
    });

    // Test recherche avec un terme qui ne donne aucun résultat
    it('should return empty array for no search results', (done) => {
        chai.request(app)
            .get('/anime/search/NonExistentAnime123456789')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });

    // Test de l'insertion d'un anime dans la liste de l'utilisateur
    it('should insert anime into user list', (done) => {
        const animeList = new AnimeList(idAnime, 1, 1, 0, 0, userId);
        chai.request(app)
            .post('/animelist')
            .set('Authorization', `Bearer ${token}`)
            .send(animeList)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    // Test de la récupération de la liste des animes de l'utilisateur
    it('should get user anime list', (done) => {
        chai.request(app)
            .get('/animelist')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                done();
            });
    });

    // Test de la modification de l'état d'un anime dans la liste de l'utilisateur
    it('should update anime state and episodes seen', (done) => {
        chai.request(app)
            .patch(`/animelist/${idAnime}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                state: 2,
                nbOfEpisodesSeen: 5
            })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    // Test de la modification de la note d'un anime dans la liste de l'utilisateur
    it('should update anime rating', (done) => {
        chai.request(app)
            .patch(`/animelist/${idAnime}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                rating: 4
            })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    // Test mise à jour avec des valeurs invalides
    it('should reject invalid rating value', (done) => {
        chai.request(app)
            .patch(`/animelist/${idAnime}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                rating: 22 // Invalid rating > 10
            })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    // Test de l'ajout d'un favoris
    it('should update favorite status', (done) => {
        chai.request(app)
            .patch(`/animelist/${idAnime}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                isFavorite: true
            })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    // Test de la récupération des détails d'un anime dans la liste de l'utilisateur
    it('should get anime details from user list', (done) => {
        chai.request(app)
            .get(`/animelist/${idAnime}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('idanime').eql(idAnime);
                done();
            });
    });

    // Test suppression d'un anime de la liste de l'utilisateur
    it('should delete anime from user list', (done) => {
        chai.request(app)
            .delete(`/animelist/${idAnime}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});