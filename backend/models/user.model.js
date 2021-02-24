/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 16/10/2020
// File: ./models/user.model.js
/*-!INFO!-*/


const mongoose = require("mongoose");
const passport = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
    userName: {type: String, required: true, unique: true, trim: true, minlength: 3},
    email: {type: String, required: true, unique: true, trim: false},
    firstName: {type: String, required: true, unique: false, trim: false},
    birthDate: {type: Date, required: false, unique: false, trim: false},
    city: {type: String, require: false, unique: false, trim: false}, 
    isLogged: {type: Boolean, required: true},
    roomID: {type: String, required: false},
    isActive: {type: Boolean, required: true},
    quizes: {type: Array, required: false},
    passwordResetRequest: {type: Boolean, required: false},
    expiresIn: {type: Date, required: false},
    lastPasswordReset: {type: Date, required: false},
    unique: {type: String, required: false},
    isAdmin: {type: String, required: false}
}, {
    timestamp: true,
}); userSchema.plugin(passport, {usernameField: "userName"});

module.exports = mongoose.model("User", userSchema);