const knexCleaner = require("knex-cleaner");
const options = {
  ignoreTables: ["knex_migrations", "knex_migrations_lock"]
};
// using this to avoid using .truncate() .del() trade off in other sees
// due to limitation of sqlite local + postgres on heroku
exports.seed = function(knex) {
  return knexCleaner.clean(knex, options);
};
