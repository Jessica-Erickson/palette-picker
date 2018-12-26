
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('palettes', function(table) {
      table.specificType('values', 'text[5]').alter();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('palettes', function(table) {
      table.string('values').alter();
    })
  ]);
};