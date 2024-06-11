const chai = require('chai')
const chaiHttp = require('chai-http');
const { app, seedDatabase, userAccountService} = require("../main");   // TODO : remplacer par le nom de votre script principal
const {expect} = require("chai");
const should = chai.should();

chai.use(chaiHttp);

describe('API Tests', function() {
    this.timeout(5000);
    let token = '';

    // Connexion à l'API pour récupérer le token JWT
    before( (done) => {
        seedDatabase().then( async () => {
            console.log("Creating test user");
            userAccountService.insert('user1', 'default').then( () => // TODO adapter à votre fonction insert()
                chai.request(app)
                    .post('/useraccount/authenticate') // TODO : remplacer par votre URL d'authentification
                    .send({login: 'user1', password: 'default'}) // TODO : remplacer par les champs attendus par votre route
                    .end((err, res) => {
                        res.should.have.status(200);
                        token = res.body.token;
                        done();
                    })
            )})
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
            .get('/useraccount/refreshtoken') // TODO : remplacer par une de vos routes protégée par validateJWT
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object'); // TODO : remplacer array par object si votre route retourne un objet
                //res.body.should.have.lengthOf(0); // TODO remplacer par votre test
                done();
            });
    });

    // Test avec un token JWT non valide
    it('should deny access with invalid token', (done) => {
        chai.request(app)
            .get('/animelist') // TODO : remplacer par une de vos routes protégée par validateJWT
            .set('Authorization', 'Bearer wrongtoken')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    // TODO : remplacer les tests ci-dessous par vos propres tests

});