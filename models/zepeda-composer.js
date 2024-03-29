/*
============================================
; Title:  zepeda-composer.js
; Author: Evelyn Zepeda
; Date:   2/4/24
; Description: Composer Mongoose model
;===========================================
*/

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Creating the Mongoose Schema
let composerSchema = new Schema({
    firstName: {type: String},
    lastName: {type: String}
})

//Export the module
module.exports = mongoose.model("Composer", composerSchema)