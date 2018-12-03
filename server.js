const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use( bodyParser.json() );

app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);

app.get('/api/v1/projects', (request, response) => {
  let projects = [];

  database('projects').select()
    .then(projectsData => {
      projects = projectsData;
    })
    .catch(error => {
      response.status(500).json({ error });
    });

  if (!projects.length) {
    return response
      .status(500)
      .send({ error: 'No projects exist yet.'});
  }

  return response
    .status(200)
    .json(projects);
});

app.post('/api/v1/projects', (request, response) => {
  const { project } = request.body.name;
  // create a new project in the projects table
  // return new project posted, project id
  // {status: "success", project_id: 1}

  if (!project) {
    return response
      .status(500)
      .send({ error: 'Project name is required, but was not provided. Please format request body to be { body: {"name": "your project name"}}'});
  }

  return response
    .status(201)
    .json({status: 'success', project_name: project, project_id: id});
});

app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;
  let project = {};

  database('projects').where('id', id).select()
    .then(projects => {
      if (projects.length) {
        project = projects[0];
      } else {
        response
          .status(404)
          .send({ error: 'Project not found'});
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });

  let palettes = [];

  database('palettes').select()
    .then(palettesData => {
      palettes = palettesData.filter(palette => {
        return palette.project_id === id;
      });
    })
    .catch(error => {
      response.status(500).json({ error });
    });

  project.palettes = palettes;

  return response
    .status(200)
    .json(project);
});

app.post('/api/v1/projects/:id/palettes', (request, response) => {
  const { id } = request.params;
  const { palette } = request.body;

  // check to see if the project exists;
  // create a new palette in the palettes table;

  if (!project) {
    return response
      .status(500)
      .send({ error: `Project with the id ${id} does not exist.`} );
  }

  for (let requiredParameter of ['name', 'values']) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, values: <Array> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  return response
    .status(201)
    .json({status: 'success', palette_name: palette.name, palette_values: palette.values, palette_id: palette_id});
  // return new palette posted, palette id
  // {status: "success", project_id: 2, palette_id: 1}
});

app.delete('/api/v1/projects/:project_id/palettes/:palette_id', (request, response) => {
  const { project_id , palette_id } = request.params;

  if (!project) {
    return response
      .status(500)
      .send({ error: `Project with the id ${project_id} does not exist.` });
  }

  if (!palette) {
    return response
      .status(500)
      .send({ error: `Palette with the id ${palette_id} does not exist` });
  }

  // delete the palette with that id

  // return palette deleted, all remaining palettes?
  // {status: "success", remaining_palettes: [palette1, palette2]}
});

app.listen(app.get('port'), () => {
  console.log(`Palette Picker is running on ${app.get('port')}.`);
});