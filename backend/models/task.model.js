/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 31/10/2020
// File: ./models/task.model.js
/*-!INFO!-*/


const mongoose = require("mongoose");
const pagination = require("mongo-cursor-pagination");

const taskSchema = mongoose.Schema({
    taskID: {type: String, required: false},
    taskAuthor: {type: String, required: true},
    taskTitle: {type: String, required: true},
    taskDesc: {type: String, required: true},
    taskTags: {type: Array, required: true},
    taskDifficulty: {type: Number, required: true},
    taskBody: {type: String, required: false},
    taskCppCode: {type: String, required: false},
    taskInFiles: {type: Array, required: false},
    taskOutFiles: {type: Array, required: false},
    taskRunTime: {type: Number, required: true},
    taskIsPublic: {type: Boolean, required: true},
    lastTake: {type: Date, required: false},
    contributors: {type: Array, required: false},
}, {
    timestamps: true,
}); taskSchema.plugin(pagination.mongoosePlugin);

module.exports = mongoose.model("Task", taskSchema);