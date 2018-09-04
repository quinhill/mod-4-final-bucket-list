exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('bucket_list_test', (table) => {
      table.increments('id').primary();
      table.string('title');
      table.string('description');

      table.timestamps(true, true);
    }),
  ])
};


exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('bucket_list_test'),
  ]);
};
