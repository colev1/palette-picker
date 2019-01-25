// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/palette_picker',
    migrations: {
      directory: './db/migrations'
    },
    production: {
      client: 'pg',
      connection: process.env.DATABASE_URL + `?ssl=true`,
      migrations: {
        directory: './db/migrations'
      },
      useNullAsDefault: true
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  }
};
