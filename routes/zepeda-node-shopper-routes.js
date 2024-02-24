/*
============================================
; Title:  zepeda-node-shopper-routes.js
; Author: Evelyn Zepeda
; Date:   2/20/24
; Description: Node shopper routes
;===========================================
*/

//Creating the required variables
const express = require('express');
const router = express.Router();
const Customer = require('../models/zepeda-customer')


/**
 * createCustomer
 * @openapi
 * /api/customers:
 *  post:
 *    summary: Creates a new customer
 *    description: Creates a new customer
 *    requestBody:
 *      description: To create a new customer
 *      content:
 *         application/json:
 *           schema:
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               userName:
 *                 type: string
 *    responses:
 *      "200":
 *        description: Customer Created
 *      "500": 
 *        description: Server Exception
 *      "501":
 *        description: MongoDB Exception
 *    tags:
 *      - Customers
 */



//Creating a new customer with POST
router.post('/customers', async(req, res) => {
    try {
        const newCustomer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName
        };

        await Customer.create(newCustomer, function(err, customer) {
            if (err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception ${err}`
                });
            } else {
                console.log(customer);
                res.json(customer)
            }
        });
    } catch(e) {
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        })
    }
});

/**
 * createInvoiceByUserName
 * @openapi
 * /api/customers/{userName}/invoices:
 *  post:
 *    summary: Creates an invoice by UserName
 *    description: Creates an invoice by UserName
 *    requestParams:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  required:
 *                      - userName
 *                  properties:
 *                      userName:
 *                          type: string
 *    requestBody:
 *      description: To create new invoice by the user's name
 *      content:
 *         application/json:
 *           schema:
 *             required:
 *              - subtotal
 *              - tax
 *              - dateCreated
 *              - lineItems
 *             properties:
 *              subtotal:
 *                  type: number
 *              tax:
 *                  type: number
 *              dateCreated:
 *                  type: string
 *              dateShipped:
 *                  type: string
 *              lineItems:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                          price:
 *                              type: number
 *                          quantity:
 *                              type: number
 *    responses:
 *      "200":
 *        description: Customer Added
 *      "500": 
 *        description: Server Exception
 *      "501":
 *        description: MongoDB Exception
 *    tags:
 *      - Customers
 */


//To create an invoice by username using POST
router.post('/customers/:userName/invoices', async(req, res) => {
    try {
        //Requiring the userName
        const customer = await Customer.findOne({userName: req.params.userName})
            
            //Creating the newInvoice constant
            const newInvoice = {
                subtotal: req.body.subtotal,
                tax: req.body.tax,
                dateCreated: req.body.dateCreated,
                dateShipped: req.body.dateShipped,
                lineItems: req.body.lineItems
            };

            //To push the new invoice 
            customer.invoices.push(newInvoice)
            await customer.save();
            return res.status(200).json({ message: 'Invoice added to MongoDB', newInvoice });
        } catch (e) {
            // If it is a mongoDB error, send a 501 response code with MongoDB error message.
            if (e.name === 'MongoError') {
                return res.status(501).json({ message: `MongoDB Exception ${e.message}` });
            }// If server error, send a 500 response code with a server error message.
            return res.status(500).json({ message: `Server Exception ${e.message}`});
    }     
});

/**
 * findAllInvoicesByUserName
 * @openapi
 * /api/customers/:username/invoices
 *  get:
 *   summary: Finds all invoices by the username
 *   description: API for returning invoices by username
 *   responses:
 *    '200':
 *      description: Customer Invoice Found
 *    '500': 
 *      description: Server Exception
 *    '501':
 *      description: MongoDB Exception
 *   tags:
 *    - Customers
 */
    
//To use GET to findAllInvoicesByUserName
router.get('/customers/:userName/invoices', async(req, res) => {
    try{
        Customer.findOne({"userName": req.params.userName}, function(err, customer) {
            if(err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception ${err}`
                });
            } else {
                console.log(customer);
                res.json(customer);
            }
        })
    } catch(e) {
        console.log(e);
        res.status(500).send({
            'message': `Server Exception ${e.message}`
        })
    }
})

//To export the router
module.exports = router