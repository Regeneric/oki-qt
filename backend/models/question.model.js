/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 16/10/2020
// File: ./models/question.model.js
/*-!INFO!-*/


const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
    id: {type: String, required: false},
    qstAuthor: {type: String, required: true},
    qstBody: {type: String, required: true},
        qstAnA: {type: String, required: true},
        qstAnB: {type: String, required: false},
        qstAnC: {type: String, required: false},
        qstAnD: {type: String, required: false},
    qstCategory: {type: String, required: true},
    correctAnswers: {type: Array, required: true},
    isPublic: {type: Boolean, required: true},
    isOpen: {type: Boolean, required: false},
}, {
    timestamps: true,
}); const Question = mongoose.model("Question", questionSchema);

module.exports = Question;