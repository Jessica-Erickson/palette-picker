// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/palettepicker',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds',
    },
    useNullAsDefault: true
  },
  testing: {
    client: 'pg',
    connection: 'postgres://localhost/palettepicker-testing',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds',
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds',
    },
    useNullAsDefault: true
  }
};
