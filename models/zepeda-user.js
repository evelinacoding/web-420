/*
============================================
; Title:  zepeda-users.js
; Author: Evelyn Zepeda
; Date:   2/16/24
; Description: User model
;===========================================
*/

//Requiring mongoose and creating a Schema 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating the userSchema
const userSchema = new Schema({
    userName: {type: String},
    password: {type: String},
    emailAddress: {type: String},
});

//Exporting the userSchema
module.exports = mongoose.model("User", userSchema);