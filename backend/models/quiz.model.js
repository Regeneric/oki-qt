/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 16/10/2020
// File: ./models/quiz.model.js
/*-!INFO!-*/


const mongoose = require("mongoose");

const quizSchema = mongoose.Schema({
    quizAuthor: {type: String, required: true},
    quizDesc: {type: String, required: true},
    quizQuestions: {type: Array, required: true},
    quizCategory: {type: String, required: true},
    quizDuration: {type: Number, required: true},
    quizStartDate: {type: Date, required: true},
    quizEndDate: {type: Date, required: false},
    contributors: {type: Array, required: false},
    isActive: {type: Boolean, required: true},
    isPublic: {type: Boolean, required: true},
    takes: {type: Number, required: true},
    lastTake: {type: Date, required: false}
}, {
    timestamps: true,
}); const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;