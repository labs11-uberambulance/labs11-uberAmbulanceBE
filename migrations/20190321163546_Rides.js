exports.up = function(knex, Promise) {
    return knex.schema.createTable('rides', function(tbl){
        tbl.increments('id').primary();
        tbl.string('driver_id').unsigned().notNullable().references('id').inTable('drivers').onUpdate('CASCADE');
        tbl.string('mother_id').unsigned().notNullable().references('id').inTable('mothers').onUpdate('CASCADE');
        tbl.string("start_village", 500)
        tbl.json('start_address');
        tbl.string('destination', 500)
        tbl.json('destination_address');
 })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('rides');
};
