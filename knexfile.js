require('dotenv').config(); 
// Update with your config settings.
const localPgConnection = {
  // placeholder since there is no pg locally
  host: "localhost",
  database: "BR-test-db",
  user: "postgres",
  password: process.env.TESTPW
};
const prodDbConnection = process.env.DATABASE_URL || localPgConnection;
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/birthrider_db.sqlite3'
    },
    useNullAsDefault: true,
  },
  testing: {
    client: 'postgresql',
    connection: localPgConnection,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'postgresql',
    connection: prodDbConnection,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
