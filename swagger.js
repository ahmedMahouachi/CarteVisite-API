const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CV Generator API",
      version: "1.0.0",
      description: "API de gestion des utilisateurs et génération de CV",
    },
    servers: [
      {
        url: "https://cartevisite-api.onrender.com",
        description: "Serveur local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  // IMPORTANT : chemins vers tes routes
  apis: ["./routes/*.js"],
};

module.exports = swaggerJSDoc(options);
