/*
============================================
; Title:  zepeda-composer-routes.js
; Author: Evelyn Zepeda
; Date:   2/4/24
; Description: Composer routes API
;===========================================
*/

//Creating variables
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

//To get a list of all the composers
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

//To request a composer by id
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

//To create a new composer
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
            });
        } else {
            console.log(composer);
            res.json(composer);
          }
        });
    } catch(e) {
        console.log(e);
        res.status(500).send({
            'message':`Server Exception: ${e.message}`
        });
    }

})

/**
 * updateComposerById
 * @openapi
 * /api/composers/{id}:
 *  put:
 *    name: updateComposersById
 *    description: An API that updates an existing composer
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: Updates an existing composer
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Updated field
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *             - firstName
 *             - lastName
 *            properties:
 *             firstName:
 *              type: string
 *             lastName:
 *              type: string
 *    summary: Updates an existing composer in MongoDB
 *    responses:
 *      "200":
 *        description: Array of composer documents
 *      "401":
 *        description: Invalid composerId
 *      "500":
 *        description: Server Exception
 *      "501":
 *        description: MongoDB Exception
 *    tags:
 *      - Composers
 */

//To update a composer by Id
router.put("/composers/:id", async(req, res) => {
    try{

        //Putting the id into a variable
        const composerId = req.params.id

        Composer.findOne({'_id': composerId}, function(err, composer) {
            //If the composer is found update the data
            if(composer) {
                composer.set({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                })

                //Saves the new composer
                composer.save(function(err, updatedComposer) {
                    if(err) {
                        //If there is a MongoDB error display the error message
                        console.log(err)
                        res.status(501).send({
                            'message': `MongoDB Exception: ${err}`
                        })
                    } else {
                        console.log(updatedComposer)
                        res.json(updatedComposer)
                    }
                })

            } else {
                //If the composer is not found give an error message
                console.log("Error: Invalid Composer ID")
                res.status(401).send({'message': `Invalid composerId`})
                
                
            }
        })
    } catch (e) {
        //If there is a server error respond with a 500 status code and the error message
        console.log(e)
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        })
        
    }
})

/**
 * deleteComposerById
 * @openapi
 * /api/composers/{id}:
 *   delete:
 *     tags:
 *       - Composers
 *     name: deleteComposerById
 *     description: An API that deletes a MongoDB document by ID
 *     summary: Delete a MongoDB document by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID for searching for a composer. 
 *         schema: 
 *           type: string
 *     responses:
 *       '200':
 *         description: Composer document deleted
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

//To deleteComposerById
router.delete('/composers/:id', async(req, res) => {

    //Putting the id into a variable
    const composerId = req.params.id
    try {
        Composer.findByIdAndDelete({'_id': composerId}, function(err, composer) {
            if(err) {

                //Log the MongoDB error
                console.log(err)
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                //To log a successful deletion
                console.log(composer)
                res.json(composer)
            }
        })
    } catch(e) {
        //To log a server error
        console.log(e)
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        })
    }
})

//To export the routes
module.exports = router;


