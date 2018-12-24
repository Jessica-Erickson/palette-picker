const starterSets = require('../starterSets');

const createProject = (knex, project) => {
  return knex("projects")
    .insert({ name: project.name }, 'id')
    .then(projectId => {
      const palettePromises = [];
      project.palettes.forEach(palette => {
        palettePromises.push(
          createPalette(knex, {
            name: palette.name,
            values: palette.values,
            project_id: projectId[0]
          })
        );
      });
      return Promise.all(palettePromises);
    });
};

const createPalette = (knex, palette) => {
  return knex("palettes").insert(palette);
};

exports.seed = function(knex, Promise) {
  return knex("palettes").del()
    .then(() => {
      knex("projects").del();
    })
    .then(() => {
      const projectPromises = [];
      starterSets.forEach(project => {
        projectPromises.push(createProject(knex, project));
      });
      return Promise.all(projectPromises);
    })
    .catch(error => {
      console.log("error", error);
    });
};