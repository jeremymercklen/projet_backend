const chai = require('chai')
const chaiHttp = require('chai-http');
const { app, seedDatabase, userAccountService} = require("../main");   // TODO : remplacer par le nom de votre script principal
const {expect} = require("chai");
const AnimeList = require("../datamodel/animelist");
const should = chai.should();

chai.use(chaiHttp);

describe('API Tests', function () {
    this.timeout(5000);
    let token = '';
    let testAnimeId;
    let testGenreId;

    before(async () => {
        await seedDatabase();
        console.log("Creating test data");

        // Create test user
        await userAccountService.insert('user1', 'default');

        // Get authentication token
        const authResponse = await chai.request(app)
            .post('/useraccount/authenticate')
            .send({login: 'user1', password: 'default'});
        token = authResponse.body.token;

        // Create test genre
        const genreResponse = await chai.request(app)
            .post('/genre')
            .set('Authorization', `Bearer ${token}`)
            .send({name: 'TestGenre'});
        testGenreId = genreResponse.body.id;

        // Create test anime
        const animeResponse = await chai.request(app)
            .post('/anime')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Anime',
                description: 'Test Description',
                episodeCount: 12,
                genres: [testGenreId]
            });
        testAnimeId = animeResponse.body.id;
    });

    after(async () => {
        console.log("Cleaning test data");
        // Clean up in reverse order
        await chai.request(app)
            .delete(`/animelist/${testAnimeId}`)
            .set('Authorization', `Bearer ${token}`);

        await chai.request(app)
            .delete(`/anime/${testAnimeId}`)
            .set('Authorization', `Bearer ${token}`);

        await chai.request(app)
            .delete(`/genre/${testGenreId}`)
            .set('Authorization', `Bearer ${token}`);

        const user = await userAccountService.get('user1');
        await userAccountService.dao.delete(user.id);
    });

    // Suppression de l'utilisateur utilisé à la fin des tests
    after( (done) => {
        console.log("Deleting test user")
        userAccountService.get('user1').then(
            (user) => {
                userAccountService.dao.delete(user.id).then(done())
            }
        )
    })

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


    describe('Anime Routes', () => {
        it('should get animes by genre with pagination', (done) => {
            chai.request(app)
                .get('/anime/Action?page=1&limit=10')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('infos');
                    res.body.should.have.property('pagination');
                    res.body.pagination.should.have.property('currentPage');
                    res.body.pagination.should.have.property('totalPages');
                    done();
                });
        });

        it('should return 404 for non-existent genre', (done) => {
            chai.request(app)
                .get('/anime/NonExistentGenre')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('Genre Routes', () => {
        it('should get most viewed genres including zero views', (done) => {
            chai.request(app)
                .get('/genre/most-viewed')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body[0].should.have.property('name');
                    res.body[0].should.have.property('count');
                    done();
                });
        });

        it('should get all genres', (done) => {
            chai.request(app)
                .get('/genre')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    done();
                });
        });
    });

    describe('AnimeList Routes', () => {
        let animeId;

        before((done) => {
            // Insert a test anime first
            chai.request(app)
                .get('/anime')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    animeId = res.body[0].id;
                    done();
                });
        });

        it('should add anime to user list', (done) => {
            chai.request(app)
                .post('/animelist')
                .set('Authorization', `Bearer ${token}`)
                .send({ idAnime: animeId })
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });

        it('should get user anime list', (done) => {
            chai.request(app)
                .get('/animelist')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body.length.should.be.above(0);
                    done();
                });
        });
    });
});