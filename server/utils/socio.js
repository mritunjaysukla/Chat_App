const Socio = require("socio.io");

const initializeSocio = (app) => {
  const socio = new Socio({
    apiKey: process.env.SOCIO_API_KEY,
  });

  app.use(socio.middleware());
};

module.exports = { initializeSocio };
