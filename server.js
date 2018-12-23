const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.json());

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
  const project = request.body;

  if (!project.name) {
    return response
      .status(500)
      .send({ error: 'Project name is required, but was not provided. Please format request body to be { body: {"name": "your project name"}}'});
  }

  database('projects').insert(project, 'id')
    .then(projectData => {
      response.status(201).json({ status: 'success', project_name: project.name, project_id: projectData[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
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
          .send({ error: `Project with the id ${id} does not exist.`});
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

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;

  database('projects').where('id', palette.project_id).select()
    .then(projects => {
      if (!projects.length) {
        response
          .status(404)
          .send({ error: `Project with the id ${palette.project_id} does not exist.`});
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });

  for (let requiredParameter of ['name', 'values', 'project_id']) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, values: <Array>, project_id: <Integer> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  if (palette.values.length !== 5 && typeof palette.values[0] !== 'string') {
    return response
      .status(422)
      .send({ error: 'Palette must have 5 values and each value must be a string.'})
  }

  database('palettes').insert(palette, 'id')
    .then(paletteData => {
      response.status(201).json({status: 'success', palette_name: palette.name, palette_values: palette.values, palette_id: palette[0], project_id: palette.project_id});
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
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