/*
============================================
; Title:  zepeda-person.js
; Author: Evelyn Zepeda
; Date:   2/9/24
; Description: People Mongoose model
;===========================================
*/


const mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Creating the roleSchema
let roleSchema = new Schema({
    text: {type: String}
})

//Creating the dependent Schema
let dependentSchema = new Schema({
    firstName: {type: String},
    lastName: {type: String}
})

//Creating the person Schema
let personSchema = new Schema({
    firstName: {type: String},
    lastName: {type: String},
    roles: [roleSchema],
    dependents: [dependentSchema],
    birthDate: {type: String}
})

//Exporting the Schema
module.exports = mongoose.model("Person", personSchema)