/*
============================================
; Title:  app.js
; Author: Evelyn Zepeda
; Date:   1/14/24
; Description: Main server file for the assignments in WEB 420 RESTful APIs
;===========================================
*/


const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

//Setting the port
app.set('port', process.env.PORT || 3000);

//Setting the app to use express/json
app.use(express.json());

//Setting the app to urlencoded
app.use(express.urlencoded({'extended': true }));

//Creating the object literal
const options = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'WEB 420 RESTFUL APIs',
            version: '1.0.0'
        },
    },
    apis: ['./routes/*.js'],
};

const openapiSpecification = swaggerJsdoc(options);

//Wiring the swaggerSpec variable
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));


//To start the server on port 3000
http.createServer(app).listen(app.get('port'), ()=> {
    console.log(`Application started and listening on port ${app.get('port')}`)
})