/*
============================================
; Title:  zepeda-person-routes.js
; Author: Evelyn Zepeda
; Date:   2/9/24
; Description: People Mongoose Routes
;===========================================
*/

const express = require('express');
const router = express.Router();
const Person = require('../models/zepeda-person');

//Creating the findAllPersons in MongoDB database operation
router.get('/persons'), async(req, res) => {
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
}

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

module.exports = router;