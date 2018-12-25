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
          for (let i = 0; i < response.body.length; i++) {
            expect(response.body[i]).to.have.property('name');
            expect(response.body[i].name).to.not.be.undefined;
          }
          done();
        });
    });
  });

  describe('Add a new project to /api/v1/projects', () => {
    it('should respond with a status of 201 if the request is appropriate', done => {
      const newProject = { name: 'Midnight\'s Repose' };
      chai.request(app)
        .post('/api/v1/projects')
        .send(newProject)
        .end((error, response) => {
          expect(response).to.have.status(201);
          expect(response.body.message).to.deep.equal('Success! Project Midnight\'s Repose has been stored and given id number 4');
          database('projects')
            .select()
            .where('id', 4)
            .then(project => {
              expect(project[0].name).to.deep.equal('Midnight\'s Repose');
              done();
            });
        });
    });

    it('should respond with a status of 409 if the project with that name already exists', done => {
      const newProject = { name: 'Spring' };
      chai.request(app)
        .post('/api/v1/projects')
        .send(newProject)
        .end((error, response) => {
          expect(response).to.have.status(409);
          expect(response.body.message).to.deep.equal('Failure: Project Spring already exists.');
          database('projects')
            .select()
            .then(projects => {
              expect(projects).to.have.length(3);
              done();
            });
        });
    });
  });
});