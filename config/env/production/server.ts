export default ({ env }) => ({
    url: env('MY_HEROKU_URL'),
    proxy: true,
});