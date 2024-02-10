/*
============================================
; Title:  zepeda-person-routes.js
; Author: Evelyn Zepeda
; Date:   2/9/24
; Description: People Mongoose Routes
;===========================================
*/

//Create variables and routes
const express = require('express');
const router = express.Router();
const Person = require('../models/zepeda-person');

/**
 * findAllPersons
 * @openapi
 * /api/persons:
 *  get:
 *   summary: Returns a list of all the people
 *   description: API for returning all people
 *   responses:
 *    '200':
 *      description: People documents
 *    '500':
 *      description: Server Exception
 *    '501':
 *      description: MongoDB Exception
 *   tags:
 *    - People
 */

//Creating the findAllPersons in MongoDB database operation
router.get('/persons', async(req, res) => {
    try {
        //Keeping {} empty searches for all the documents
        Person.find({}, function(err, persons) {
            if(err) {
                console.log(err)
                res.status(501).send({
                    'message': `MongoDB Exception ${err}`
                })

            } else {
                console.log(persons);
                res.json(persons);
            }
        })
    } catch(e) {
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        })
    }
})

/**
 * createPerson
 * @openapi
 * /api/persons:
 *  post:
 *   summary: Creates a new person
 *   description: Adds a new person to the collection
 *   requestBody:
 *    description: To create a new person
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - firstName
 *        - lastName
 *        - roles
 *        - dependents
 *       properties:
 *        firstName:
 *         type: string
 *        lastName:
 *         type: string
 *        roles:
 *         type: array
 *         items:
 *          type: object
 *        dependents:
 *         type: array
 *         items:
 *          type: object
 *        birthDate:
 *         type: string
 *   responses:
 *    "200":
 *      description: Person added
 *    "500":
 *      description: Server Exception
 *    "501":
 *      description: MongoDB Exception
 *   tags:
 *    - People
 */

//To create a new person
router.post('/persons', async(req, res) => {
    try {
        const newPerson = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            roles: req.body.roles,
            dependents: req.body.dependents,
            birthDate: req.body.birthDate
        }

        await Person.create(newPerson, function(err, persons) {
            if (err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                console.log(persons)
                res.json(persons)
            }
        })
    } catch(e) {
        console.log(e);
        res.status(500).send({
            'message': `Server Exception ${e.message}`
        })
    }

})

//To export the routes
module.exports = router;