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
 * signup
 * @openapi
 * /api/signup:
 *   post:
 *     tags:
 *       - Register
 *     description: Sign Up API
 *     summary: Create a new sign on.
 *     requestBody:
 *       description: creation of username
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - userName
 *               - password
 *               - emailAddress
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *               emailAddress:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Registered user.
 *       '401':
 *         description: Username is already in use.
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */




//The signup route
router.post('/signup', async(req, res) => {
    try {
        const { userName, password, emailAddress } = req.body;
        const currentUser = await User.findOne({ userName });
    
        if (!currentUser) {
          const hashedPassword = bcrypt.hashSync(password, saltRounds);
          const newRegisteredUser = {
            userName,
            password: hashedPassword,
            emailAddress,
          };
    
          await User.create(newRegisteredUser, function (err, user) {
            if (err) {
              console.log(err);
              res.status(501).send({
                message: `MongoDB Exception: ${err}`,
              });
            } else {
              console.log(user);
              res.send({ message: 'Registered user.' });
            }
          });
        } else {
          res.status(401).send({ message: 'Username is already in use.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Exception.' });
    }
});

/**
 * login
 * @openapi
 * /api/login:
 *  post:
 *    tags:
 *      - User
 *    description: Verify login credentials
 *    summary: Verify login credentials
 *    requestBody:
 *      description: user login credentials
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - userName
 *              - password
 *            properties:
 *              userName:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      "200":
 *        description: User logged in
 *      "401":
 *        description: Invalid username and/or password
 *      "500":
 *        description: Server Exception
 *      "501":
 *        description: MongoDB Exception
 */

//The longin route
router.post("/login", async (req, res) => {
    try {
      const userCredentials = {
        userName: req.body.userName,
        password: req.body.password,
      };
  
      const user = await User.findOne({ userName: userCredentials.userName });
      // A way to check if the user exists and matching the password
      if (user) {
        let passwordIsValid = bcrypt.compareSync(
          userCredentials.password,
          user.password
        );
        // Checking password validity and passing the status 
        if (passwordIsValid) {
          res.status(200).send({ message: "User logged in" });
        } else {
          res.status(401).send({ message: "Invalid username and/or password" });
        }
      } else {
        res.status(401).send({ message: "Invalid username and/or password" });
      }
    } catch (e) {
      res.status(500).send({ message: `Server Exception: ${e.message}` });
    }
  });

//Exporting the router
module.exports = router