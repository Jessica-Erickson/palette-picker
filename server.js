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
    });
});

app.post('/api/v1/projects', (request, response) => {
  // post a new project
});

app.get('/api/v1/projects/:id', (request, response) => {
  // get all palettes associated with a particular project
});

app.delete('api/v1/projects/:id', (request, response) => {
  // delete project with id
});

app.post('/api/v1/palettes', (request, response) => {
  // post a new palette
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  // delete a palette
});

app.listen(app.get('port'), () => {
  console.log(`Palette Picker is running on ${app.get('port')}.`);
});

module.exports = app;