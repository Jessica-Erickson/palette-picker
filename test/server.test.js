const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
const app = require('../server.js');
const environment = 'testing';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHTTP);

describe('Palette Picker API V1', () => {
  beforeEach(done => {
    database.migrate.rollback()
      .then(() => database.migrate.latest())
      .then(() => database.seed.run())
      .then(() => done());
  });

  describe('Get all projects from /api/v1/projects', () => {
    it('should respond with a status of 200 and an array of existing projects', done => {
      chai.request(app)
        .get('/api/v1/projects')
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body).to.be.an('array');
          expect(response.body).to.have.length(3);
          for (let i = 0; i < 3; i++) {
            expect(response.body[i]).to.have.property('name');
            expect(response.body[i].name).to.not.be.undefined;
          }
          done();
        });
    });
  });
});