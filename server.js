const express = require('express');
const app = express();

app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);

app.get('/api/v1/projects', (request, response) => {
  // return [project 1, project 2, project 3]
});

app.post('/api/v1/projects', (request, response) => {
  // create a new project in the projects table
  // return new project posted, project id
  // {status: "success", project_id: 1}
});

app.get('/api/v1/projects/:id', (request, response) => {
  // return {project 1: palettes: [palette1, palette2, palette3]}
});

app.post('/api/v1/projects/:id/palettes', (request, response) => {
  // create a new palette in the palettes table
  // return new palette posted, palette id
  // {status: "success", project_id: 2, palette_id: 1}
});

app.delete('/api/v1/projects/:project_id/palettes/:palette_id', (request, response) => {
  // return palette deleted, all remaining palettes?
  // {status: "success", remaining_palettes: [palette1, palette2]}
});

app.listen(app.get('port'), () => {
  console.log(`Palette Picker is running on ${app.get('port')}.`);
});