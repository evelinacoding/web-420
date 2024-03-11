/*
============================================
; Title:  zepeda-team.js
; Author: Evelyn Zepeda
; Date:   3/9/24
; Description: Team Model
;===========================================
*/

// Mongoose and Schema variables
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Creating the player schema
let playerSchema = new Schema({
    firstName: {type:String},
    lastName: {type:String},
    salary: {type: Number}
});

// Creating the team schema
let teamSchema = new Schema({
    name: {type: String},
    mascot: {type: String},
    players: [playerSchema],
});

//Exporting the team schema
module.exports = mongoose.model("Team", teamSchema);