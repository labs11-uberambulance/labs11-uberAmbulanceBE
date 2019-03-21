exports.up = function(knex, Promise) {
    return knex.schema.createTable('drivers', function(tbl){
    tbl.increments('id').primary();
    tbl.string('google_id').unsigned().notNullable().references('google_id').inTable('users').onUpdate('CASCADE');
    tbl.json('address').notNullable()
    tbl.string('email', 255)
    tbl.date('due_date').notNullable();
    tbl.integer('price');
    tbl.boolean('active');
    tbl.string('bio', 500)
 })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('drivers');
};
