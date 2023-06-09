export default ({ env }) => ({
  "users-permissions": {
    config: {
      jwt: {
        expiresIn: "7d",
      },
      email: {
        config: {
          provider: "nodemailer",
          providerOptions: {
            host: "smtp.gmail.com",
            port: 465,
            auth: {
              user: "dan@thedistractionsband.co.uk",
              pass: process.env.GOOGLE_APP_PASSWORD,
            },
            authMethod: "SMTP",
          },
          settings: {
            defaultFrom: "info@thedistractionsband.co.uk",
            defaultReplyTo: "info@thedistractionsband.co.uk",
          },
        },
      },
    },
  },
});
