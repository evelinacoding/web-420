/*
============================================
; Title:  zepeda-session-routes.js
; Author: Evelyn Zepeda
; Date:   2/16/24
; Description: Session routes
;===========================================
*/

//Creating the required variables
const express = require('express');
const router = express.Router();
const User = require('../models/zepeda-user')
const bcrypt = require('bcryptjs')

let saltRounds = 10;

/**
 * signUp
 * @openapi
 * /api/signup:
 *  post:
 *   tags:
 *     - Register
 *   summary: Register password
 *   requestBody:
 *    description: Password information
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - userName
 *              - password
 *              - emailAddress
 *       properties:
 *        userName:
 *         type: string
 *        password:
 *         type: string
 *        emailAddress:
 *         type: array
 *        properties:
 *         email:
 *          type: string
 *    responses:
 *     '200':
 *       description: Password added to MongoDB
 *     '401':
 *       description: Username is already in use
 *     '500':
 *       description: Server Exception
 *     '501':
 *       descrption: MongoDB Exception
 */

//The signup route
router.post('/signup', async(req, res) => {
    try {

        User.findOne({userName: req.body.userName}, function(err,user) {
            if(!user) {
                let hashedPassword = bcrypt.hashSync(req.body.Password, saltRounds)
                const newRegisteredUser = {
                    userName: req.body.userName,
                    Password: hashedPassword,
                    emailAddress: req.body.emailAddress,
                };

            User.create(newRegisteredUser, function(err, user) {
                if(user) {
                    console.log(err)
                    res.status(401).send({
                        message: `Username is already in use: ${err}`,
                    });
                } else {
                    console.log(user)
                    res.json(user);
                }
            });

        } else {
            console.log(e);
            res.status(501).send({
                message: `MongoDB Exception ${err}`,
            })
        }
    }) 

    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: `Server Exception: ${e.message}`,
        })
    }
})

/**
 * login
 * @openapi
 * /api/login:
 *   post:
 *     tags:
 *       - UserName
 *       - passwords
 *     name: login
 *       summary: logs in user
 *     requestBody:
 *       description: login information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - userName
 *               - Password
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password added to MongoDB
 *       '401':
 *         description: Invalid userName or Password
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
*/

//The longin route
router.post('/login', async(req, res) => {
    try {
        User.findOne({userName: req.body.userName}, function (err, user) {
            if(!user) {
                console.log(user);
                res.status(501).send({
                    'message': `MongoDB Exception ${err}`
                })
            } else {
                console.log(user)
                if(user) {
                    let passwordIsValid = bcrypt.compareSync(req.body.Password, user.Password);

                    if (user) {
                        console.log('User logged in');
                        res.status(200).send({
                            'message': 'User logged in'
                        })
                    } else {
                        console.log('Invalid username and/or password');
                        res.status(401).send({
                            'message': `Invalid username and/or password`
                        })
                    }
                } else {
                    console.log('Invalid passId');
                    res.status(401).send({
                        'message': `Invalid username and/or password`
                    })
              
                }
            }
        }) 
    } catch(e) {
        console.log(e);
        res.status(500).send({
            'message': `Server Exception ${e}`
        })
    }
})

//Exporting the router
module.exports = router