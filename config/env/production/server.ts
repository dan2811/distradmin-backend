export default ({ env }) => ({
    url: env('STRAPI_DEPLOYMENT_URL', 'https://distradmin-backend.herokuapp.com'),
    proxy: true,
});