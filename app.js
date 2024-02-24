/*
============================================
; Title:  app.js
; Author: Evelyn Zepeda
; Date:   1/14/24
; Description: Main server file for the assignments in WEB 420 RESTful APIs
;===========================================
*/


//To create variables and routes
const express = require('express');
const http = require('http');
const swaggerui = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
var mongoose = require('mongoose');
const composerAPI = require('./routes/zepeda-composer-routes')
const personAPI = require('./routes/zepeda-person-routes')
const usersAPI = require('./routes/zepeda-session-routes')
const customerAPI = require('./routes/zepeda-node-shopper-routes')

const app = express();



//Setting the app to use express/json
app.use(express.json())
app.use(express.urlencoded({extended: true }))


//Setting the port
app.set('port', process.env.PORT || 3000);

//Setting up the MongoDB connection
const conn = 'mongodb+srv://web420_user:s3cret@bellevueuniversity.8vzftv7.mongodb.net/web420DB?retryWrites=true&w=majority'

//'mongodb+srv://web420_user:s3cret@bellevueuniversity.8vzftv7.mongodb.net/web420DB'

mongoose.connect(conn, {
    promiseLibrary: require('bluebird'),
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("Connection to the MongoDB database was succesful")
}).catch(err => {
    console.log(`MongoDB Error: ${err.message}`)
})


//Creating the object literal
const options = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'WEB 420 RESTFUL APIs',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.js']
};

const openapiSpecification = swaggerJsdoc(options);


//Wiring the swaggerSpec variable
app.use('/api-docs', swaggerui.serve, swaggerui.setup(openapiSpecification));

app.use('/api', composerAPI)
app.use('/api', personAPI)
app.use('/api', usersAPI)
app.use('/api', customerAPI)



//To start the server on port 3000
http.createServer(app).listen(app.get('port'), ()=> {
    console.log(`Application started and listening on port ${app.get('port')}`)
})