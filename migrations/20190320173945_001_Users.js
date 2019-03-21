
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(tbl){
        tbl.increments('id').primary();
        tbl.string("name", 255).notNullable();
        tbl.string("email", 255);
        tbl.string("google_id", 500).notNullable().unique();
        tbl.integer("phone").notNullable()
        tbl.enum('user_type', ['mothers', 'drivers']).notNullable()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};
