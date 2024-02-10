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


/**
 * findAllComposers
 * @openapi
 * /api/composers:
 *  get:
 *   summary: Returns a list of composer documents
 *   description: API for returning a list of composers from MongoDB Atlas
 *   responses:
 *    '200':
 *      description: Composer documents
 *    '500': 
 *      description: Server Exception
 *    '501':
 *      description: MongoDB Exception
 *   tags:
 *    - Composers
 */

router.get('/composers', async(req, res) => {
    try {
    
      Composer.find({}, function(err, composers) {
            if(err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception ${err}`
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
  })

/**
 * findComposerById
 * @openapi
 * /api/composers/{id}:
 *  get:
 *    description: The composerId requested by the user
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The composerId requested by the user
 *        schema:
 *          type: string
 *    summary: Returns a single composer
 *    responses:
 *      "200":
 *        description: Composer document in JSON format
 *      "500":
 *        description: Server Exception
 *      "501":
 *        description: MongoDB Exception
 *    tags:
 *      - Composers
 */

router.get('/composers/:id', async(req, res) => {
    try {
        Composer.findOne({'_id' : req.params.id}, function(err, composers) {
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

/**
 * createComposer
 * @openapi
 * /api/composers:
 *  post:
 *    summary: Creates a composer
 *    description: Adds a new composer
 *    requestBody:
 *      description: To create a new composer
 *      content:
 *         application/json:
 *           schema:
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *    responses:
 *      "200":
 *        description: User added
 *      "500": 
 *        description: Server Exception
 *      "501":
 *        description: MongoDB Exception
 *    tags:
 *      - Composers
 */


router.post('/composers', async(req, res) => {
    try {
        const newComposer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName        
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


