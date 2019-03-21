exports.up = function(knex, Promise) {
    return knex.schema.createTable('mothers', function(tbl){
    tbl.increments('id').primary();
    tbl.string('google_id').unsigned().notNullable().references('google_id').inTable('users').onUpdate('CASCADE');
    tbl.string('address').notNullable()
    tbl.boolean('caretaker')
    tbl.date('due_date').notNullable();
    tbl.string('stripe_id')
 })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('mothers');
};
