/*
============================================
; Title:  zepeda-team-routes.js
; Author: Evelyn Zepeda
; Date:   3/9/24
; Description: Composer routes API
;===========================================
*/

// Creating the express variables
const express = require('express');
const router = express.Router();
const Team = require('../models/zepeda-team');


/**
 * findAllTeams
 * @openapi
 * /api/teams:
 *  get:
 *   summary: Returns a list of teams
 *   description: API for returning a list of all teams from MongoDB Atlas
 *   responses:
 *    '200':
 *      description: Team documents
 *    '500': 
 *      description: Server Exception
 *    '501':
 *      description: MongoDB Exception
 *   tags:
 *    - Teams
 */

// GET method to return all of the teams
router.get('/teams', async(req, res) => {
    try{
        //Finds all the teams
        Team.find({}, function(err, teams) {

            //Prints an error if there is an error
            if(err) {
                console.log(err)
                //A MongoDB Exception error message
                res.status(501).send({
                    'message': `MongoDB Exception ${err}`
                })
            //Logs the teams if they are correctly found
            } else {
                console.log(teams)
                res.json(teams)
            }
        })
    } catch(e) {
        console.log(e);
        //A Server Exception response message
        res.status(500).send({
            'message': `Server Exception ${e.message}`
        })
    }
});

/**
 * findAllPlayersByTeamId
 * @openapi
 * /api/teams/{id}/players:
 *  get:
 *   summary: Returns all the players by TeamId
 *   description: API for returning all players
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: Returns all players
 *      schema:
 *          type: string
 *   responses:
 *    '200':
 *      description: Array of player documents
 *    '401':
 *      description: Invalid teamId
 *    '500': 
 *      description: Server Exception
 *    '501':
 *      description: MongoDB Exception
 *   tags:
 *    - Teams
 */

//To find all the players in a team
router.get('/teams/:id/players', async(req, res) => {
    try{
        //Putting the team in a variable(so that I can access .players)
        const team = await Team.findById(req.params.id)

        //If the teamId is incorrect send an error message
        if (!team) {
            res.status(401).json({ message: 'Invalid teamId'})
        }
        //A positive respond status
        res.status(200).json(team.players)

    } catch(e) {
        //Matches a ServerError with an error message
        if(e.name === 'ServerError') {
            return res.status(500).json({message: `Server Exception: ${e.message}`})
        }
        //Sends a response with a 501 message for a MongoDB Exception
        res.status(501).json({message: `MongoDB Exception: ${e.message}`})
    }
})

/**
 * assignPlayerToTeam
 * @openapi
 * /api/teams/{id}/players:
 *   post:
 *     tags:
 *       - Teams
 *     name: assignPlayerToTeam
 *     description: API for adding players to an existing team document.
 *     summary: Creates player document and adds it to a team with the specified teamId. 
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Team Id
 *         schema: 
 *           type: string
 *     requestBody:
 *       description: Player to add
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *               - salary
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               salary:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Player document
 *       '401':
 *         description: Invalid teamId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

// POST method to assignPlayerToTeam
router.post('/teams/:id/players', async(req, res) => {
    try { 
        // To search for the team by its id
        const team = await Team.findById(req.params.id)
        
        //Invalid teamId message send if the id is not valid
        if (!team) {
            res.status(401).json({ message: 'Invalid teamId' })
        }

        // Creates a player
        const player = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            salary: req.body.salary
        }
        // Pushes the players to the team(array)
        team.players.push(player);

        // To save to MongoDB
        await team.save();

        // A positive respond code
        res.status(200).json(team)

    } catch (e) {
        // An if statement that logs a server error
        if (e.name === 'ServerError') {
            return res.status(500).json({ message: `Server Exception: ${e.message}`})
        }
        // MongoDB Exception response
        res.status(501).json({message: `MongoDB Exception: ${e.message}`});

   }
});

/**
 * deleteTeamById
 * @openapi
 * /api/teams/{id}:
 *   delete:
 *     tags:
 *       - Teams
 *     name: deleteTeamById
 *     description: Deletes a team by its id
 *     summary: Delete a team by teamId
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID for searching for a team. 
 *         schema: 
 *           type: string
 *     responses:
 *       '200':
 *         description: Team document deleted
 *       '401':
 *         description: Invalid teamId
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

//Deletes the team by teamId
router.delete('/teams/:id', async(req, res) => {

    //A variable for the input id for the team
    const teamId = req.params.id

    try {
        //Finds and deletes a team by its id
        Team.findByIdAndDelete({'_id': teamId}, function (err, team) {
            if(err) {
                //Log the MongoDB error
                console.log(err)
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                //To log a successful deletion of a team
                console.log(team)
                res.json(team)
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

// Exports the router
module.exports = router