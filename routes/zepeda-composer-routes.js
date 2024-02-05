/*
============================================
; Title:  zepeda-composer-routes.js
; Author: Evelyn Zepeda
; Date:   2/4/24
; Description: Composer routes API
;===========================================
*/

const express = require('express');
const router = express.Router();
const Composer = require('../models/zepeda-composer');

/*openapi: 3.0.0
info:
  title: Composer API
  version: "1.0."
paths:
  /composers:
    get:
      tags:
        - composers
      summary: Returns a list of composer documents
      responses:
        "200":
          description: Composer documents
        "500":
          description: Server Exception
        "501":
          description: MongoDB Exception
          */

router.get('/api/composers', async(req, res) => {
    try {
        Composer.find({}, function(err, composers) {
            if(err) {
                console.log(err);
                res.status(501).send({
                    'message':`MongoDB Exception ${err}`
                })

            } else {
                console.log(composers);
                res.json(composers);
            }
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            'message': `Server Exception ${e.message}`
        })
    }
});

/*
/composers/{id}:
get:
  tags:
    - composers
  description: API for returning a single composer object
  parameters:
    - name: id
      in: path
      description: The composerId requested by the user
      required: true
      schema:
        type: string
  summary: Returns a composer document
  responses:
    "200":
      description: Composer document in JSON format
    "500":
      description: Server Exception
    "501":
      description: MongoDBException

*/

router.get('/api/composers/:id', async(req, res) => {
    try {
        Composer.findOne({'_id': req.params.id}, function(err, composers) {
            if(err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                console.log(composers);
                res.json(composers);
            }
        })
    } catch(e) {
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        })
    }
})

/* post:
      summary: Creates a new composer object
      tags:
        - composers
      requestBody:
        description: Composers information
        content:
          application/json:
            schema:
              properties:
                firstName:
                  type: string
                lastName:
                  type: string
      responses:
        "200":
          description: User added
        "500":
          description: Server Exception
        "501":
          description: MongoDBException
          */

router.post('/composers', async(req, res) => {
    try {
        const newComposer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            id: req.body.id
           
        };

        await Composer.create(newComposer, function(err, composer) {
        if (err) {
            console.log(err);
            res.status(501).send({
                'message': `MongoDB Exception ${err}`
            })
        } else {
            console.log(composer);
            res.json(composer);
        }
    })
    } catch(e) {
        console.log(e);
        res.status(500).send({
            'message':`Server Exception: ${e.message}`
        })
    }

})

module.exports = router;
