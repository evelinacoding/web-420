/*
============================================
; Title:  zepeda-customer.js
; Author: Evelyn Zepeda
; Date:   2/20/24
; Description: Customer model
;===========================================
*/

//Requiring mongoose and creating a schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating the customer schema
const lineItemSchema = new Schema({
    name: {type: String},
    price: {type: Number},
    quantity: {type: Number}
});

const invoiceSchema = new Schema({
    subtotal: {type: Number},
    tax: {type: Number},
    dateCreated: {type: String},
    dateShipped: {type: String},
    lineItems: [lineItemSchema]
});

const customerSchema = new Schema({
    firstName: {type: String},
    lastName: {type: String},
    userName: {type: String},
    invoices: [invoiceSchema]
});

module.exports= mongoose.model("Customer", customerSchema)