const knex = require('knex');
const knexConfig = require('../knexfile.js')
const db = knex(knexConfig.development);

module.exports = {
    add,
    find,
    findBy,
    findById,
  };
  function find() {
    return db('users').select('id', 'name');
  }
  function findBy(filter) {
    return db('users').where(filter);
  }
  async function add(user) {
    const [id] = await db('users').insert(user);
    return findById(id);
  }
  function findById(id) {
    return db('users').select('id', 'username', 'email', 'org_name')
      .where({ id })
      .first();
  }
