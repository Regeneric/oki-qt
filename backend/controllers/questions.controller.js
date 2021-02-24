/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 16/10/2020
// File: ./controllers/questions.controller.js
/*-!INFO!-*/

const Question = require("../models/question.model");

module.exports = {
    findOne: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403);
        else {
            const question = await Question.findOne({_id: req.params.id});
            if(!question) return next();
            else return res.status(200).send(question);
        }
    },
    findAll: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403);
        else {
            const questions = await Question.find(req.filters).sort({createdAt: "desc"});
            if(!questions) return next();
            else return res.status(200).send(questions);
        }
    },
    create: async (req, res) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403);
        else {
            const question = await new Question({
                id: req.body.id,
                qstAuthor: req.body.qstAuthor,
                qstBody: req.body.qstBody,
                    qstAnA: req.body.qstAnA,
                    qstAnB: req.body.qstAnB,
                    qstAnC: req.body.qstAnC,
                    qstAnD: req.body.qstAnD,
                qstCategory: req.body.qstCategory,
                correctAnswers: req.body.correctAnswers,
                isPublic: req.body.isPublic,
                isOpen: req.body.isOpen,
            }).save();

            return res.status(201);
        }
    },
    update: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403);
        else {
            const question = await Question.findOne({_id: req.params.id});
            if(!question) return next();

            if(req.body.id) question.id = req.body.id;
            if(req.body.qstAuthor) question.qstAuthor = req.body.qstAuthor;
            if(req.body.qstBody) question.qstBody = req.body.qstBody;
                if(req.body.qstAnA) question.qstAnA = req.body.qstAnA;
                if(req.body.qstAnB) question.qstAnB = req.body.qstAnB;
                if(req.body.qstAnC) question.qstAnC = req.body.qstAnC;
                if(req.body.qstAnD) question.qstAnD = req.body.qstAnD;
            if(req.body.qstCategory) question.qstCategory = req.body.qstCategory;
            if(req.body.correctAnswers) question.correctAnswers = req.body.correctAnswers;
            if(req.body.isPublic) question.isPublic = req.body.isPublic;
            if(req.body.isOpen) question.isOpen = req.body.isOpen;

            await question.save();
            return res.status(200);
        }
    },
    remove: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403);
        else {
            const question = await Question.findOne({_id: req.params.id});
            if(!question) return next();
            else await question.remove();

            return res.status(200);
        }
    }
};