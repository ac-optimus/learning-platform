const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Name',
            version: '1.0.0',
            description: 'A short description of your API',
        },
    },
    apis: ['./routes/*.js'], // Path to your API documentation
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
