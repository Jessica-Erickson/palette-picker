
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('projects', function(table) {
      table.dropTimestamps();
    }),
    knex.schema.table('palettes', function(table) {
      table.dropTimestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('projects', function(table) {
      table.timestamps(true, true);
    }),
    knex.schema.table('palettes', function(table) {
      table.timestamps(true, true);
    })
  ]);
};
