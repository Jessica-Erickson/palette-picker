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

    it('should respond with a status of 422 if the request body does not have a name', done => {
      const newProject = { potato: 'Fire' };
      chai.request(app)
        .post('/api/v1/projects')
        .send(newProject)
        .end((error, response) => {
          expect(response).to.have.status(422);
          expect(response.body.message).to.deep.equal('Failure: request body should be { name: <String> }');
          database('projects')
            .select()
            .then(projects => {
              expect(projects).to.have.length(3);
              done();
            });
        });
    });

    it('should respond with a status of 422 if the request body name is an empty string', done => {
      const newProject = { name: '' };
      chai.request(app)
        .post('/api/v1/projects')
        .send(newProject)
        .end((error, response) => {
          expect(response).to.have.status(422);
          expect(response.body.message).to.deep.equal('Failure: request body should be { name: <String> }');
          database('projects')
            .select()
            .then(projects => {
              expect(projects).to.have.length(3);
              done();
            });
        });
    });
  });

  describe('Get all palettes for a given project from /api/v1/project/:id', () => {
    it('should respond with a status of 200 and return an array of all palettes associated with a given project if it exists', done => {
      chai.request(app)
        .get('/api/v1/project/2')
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an('array');
          for (let i = 0; i < response.body.length; i++) {
            expect(response.body[i]).to.have.property('name');
            expect(response.body[i]).to.have.property('values');
            expect(response.body[i]).to.have.property('project_id');
            expect(response.body[i].name).to.not.be.undefined;
            expect(response.body[i].values).to.be.an('array');
            expect(response.body[i].project_id).to.equal(2);
          }
          done();
        });
    });

    it('should respond with a status of 404 if the project with that id does not exist', done => {
      chai.request(app)
        .get('/api/v1/project/404')
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body.message).to.deep.equal('A project with id 404 does not exist.');
          done();
        });
    });

    it('should respond with a status of 200 and return an empty array if a project exists, but does not have any palettes associated with it', done => {
      chai.request(app)
        .post('/api/v1/projects')
        .send({ name: 'Lonely' })
        .end((error, response) => {
          chai.request(app)
            .get('/api/v1/project/4')
            .end((error, response) => {
              expect(response).to.have.status(200);
              expect(response.body).to.be.an('array');
              expect(response.body).to.have.length(0);
              done();
            });
        });
    });
  });

  describe('Delete a project from /api/v1/project/:id', () => {
    it('should respond with a status of 202 and delete a project if it exists', done => {
      chai.request(app)
        .delete('/api/v1/project/2')
        .end((error, response) => {
          expect(response).to.have.status(202);
          expect(response.body.message).to.equal('The project with id 2 has been deleted');
          database('projects')
            .where('id', 2)
            .select()
            .then(project => {
              expect(project).to.have.length(0);
              done();
            });
        });
    });

    it('should respond with a status of 404 if the project does not exist', done => {
      chai.request(app)
        .delete('/api/v1/project/404')
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body.message).to.equal('A project with id 404 does not exist');
          database('projects')
            .select()
            .then(projects => {
              expect(projects).to.have.length(3);
              done();
            });
        });
    });
  });

  describe('Post a new palette to /api/v1/palettes', () => {
    it('should respond with a status of 201 if the request is appropriate', done => {
      const newPalette = {
                            name: 'Coral',
                            values: ['#E4ECCC', '#F5E6A3', '#F6AF7D', '#FA7964', '#554F40'],
                            project_id: 2
                          };

      chai.request(app)
        .post('/api/v1/palettes')
        .send(newPalette)
        .end((error, response) => {
          expect(response).to.have.status(201);
          expect(response.body.message).to.deep.equal('Success! Palette Coral has been stored and given id number 10');
          database('palettes')
            .select()
            .then(palettes => {
              expect(palettes).to.have.length(10);
              done();
            });
        });
    });

    it('should respond with a status of 409 if a palette with that name already exists', done => {
      const newPalette = {
                            name: 'Lakeside',
                            values: ['#E4ECCC', '#F5E6A3', '#F6AF7D', '#FA7964', '#554F40'],
                            project_id: 1
                          };

      chai.request(app)
        .post('/api/v1/palettes')
        .send(newPalette)
        .end((error, response) => {
          expect(response).to.have.status(409);
          expect(response.body.message).to.deep.equal('Failure: Palette Lakeside already exists.');
          database('palettes')
            .select()
            .then(palettes => {
              expect(palettes).to.have.length(9);
              done();
            });
        });
    });

    it('should respond with a status of 500 if the associated project does not exist', done => {
      const newPalette = {
                            name: 'Coral',
                            values: ['#E4ECCC', '#F5E6A3', '#F6AF7D', '#FA7964', '#554F40'],
                            project_id: 404
                          };

      chai.request(app)
        .post('/api/v1/palettes')
        .send(newPalette)
        .end((error, response) => {
          expect(response).to.have.status(500);
          done();
        });
    });

    it('should respond with a status of 422 if the request does not have a name, values, or project_id', done => {
      const newPalette = {
                            name: 'Coral',
                            potato: ['#E4ECCC', '#F5E6A3', '#F6AF7D', '#FA7964', '#554F40'],
                            project_id: 2
                          };

      chai.request(app)
        .post('/api/v1/palettes')
        .send(newPalette)
        .end((error, response) => {
          expect(response).to.have.status(422);
          expect(response.body.message).to.deep.equal('Failure: request body should be { name: <String>, values: <String[]>, project_id: <Int> }');
          database('palettes')
            .select()
            .then(palettes => {
              expect(palettes).to.have.length(9);
              done();
            });
        });
    });

    it('should respond with a status of 422 if the request\'s values value is not an array of five strings', done => {
      const newPalette = {
                            name: 'Coral',
                            values: [1, 2, 3, 4, 5],
                            project_id: 2
                          };

      chai.request(app)
        .post('/api/v1/palettes')
        .send(newPalette)
        .end((error, response) => {
          expect(response).to.have.status(422);
          expect(response.body.message).to.deep.equal('Failure: request body should be { name: <String>, values: <String[]>, project_id: <Int> }');
          database('palettes')
            .select()
            .then(palettes => {
              expect(palettes).to.have.length(9);
              done();
            });
        });
    });
  });
});