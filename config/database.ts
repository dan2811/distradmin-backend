export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', process.env.PROD ? process.env.DATABASE_HOST : '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'postgres'),
      user: env('DATABASE_USERNAME', 'postgres'),
      password: env('DATABASE_PASSWORD', process.env.PROD ? process.env.DATABASE_PASSWORD : 'password'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
