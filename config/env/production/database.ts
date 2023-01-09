import pgConnectionString = require('pg-connection-string');
const config = pgConnectionString.parse(process.env.DATABASE_URL);

export default ({ env }) => ({
    connection: {
        client: 'postgres',
        connection: {
            host: config.host,
            port: config.port,
            database: config.database,
            user: config.user,
            password: config.password,
            ssl: {
                rejectUnauthorized: false
            },
        },
        debug: false,
    },
});
