const chai = require('chai')
const chaiHttp = require('chai-http');
const { app, seedDatabase, userAccountService, animeService, genreService, animeListService} = require("../main");
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

            // Récupération de l'id interne de l'anime
            const result = await animeService.getByIdAPI(anime.idAPI);
            idAnime = result.rows[0].id;
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

                    animeService.deleteById(idAnime);
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
});