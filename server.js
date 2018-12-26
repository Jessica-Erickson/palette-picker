const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.json());

app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);

app.get('/api/v1/projects', (request, response) => {
  database('projects')
    .select()
    .then(projects => {
      response.status(200).json(projects);
    })
    .catch(error => {
      response.status(500).send({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  const { name } = request.body;

  if (!name) {
    return response.status(422).send({ message: 'Failure: request body should be { name: <String> }'});
  }

  database('projects')
    .select()
    .then(projects => {
      const exists = projects.some(project => project.name === name);
      if (exists) {
        response.status(409).send({ message: `Failure: Project ${name} already exists.`});
      } else {
        database('projects')
          .insert({ name }, 'id')
          .then(project_id => {
            response.status(201).send({ message: `Success! Project ${name} has been stored and given id number ${project_id[0]}` });
          })
          .catch(error => {
            response.status(500).send({ error });
          });
      }
    })
    .catch(error => {
      response.status(500).send({ error });
    });
});

app.get('/api/v1/project/:id', (request, response) => {
  const { id } = request.params;

  database('palettes')
    .where('project_id', parseInt(id))
    .select()
    .then(palettes => {
      response.status(200).json(palettes);
    })
    .catch(error => {
      response.status(500).send({ error });
    });
});

app.delete('api/v1/project/:id', (request, response) => {
  // delete project with id
});

app.post('/api/v1/palettes', (request, response) => {
  // post a new palette
});

app.delete('/api/v1/palette/:id', (request, response) => {
  // delete a palette
});

app.use((request, response, next) => {
  response.status(404).send({ message: 'The page you are looking for does not exist. Please try /api/v1/projects instead.'});
});

app.listen(app.get('port'), () => {
  console.log(`Palette Picker is running on ${app.get('port')}.`);
});

module.exports = app;