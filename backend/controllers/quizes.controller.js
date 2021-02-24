/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 16/10/2020
// File: ./controllers/quizes.controller.js
/*-!INFO!-*/

const Quiz = require("../models/quiz.model");

String.prototype.escapeDiac = function() {
    return this.replace(/ą/g, 'a').replace(/Ą/g, 'A')
               .replace(/ć/g, 'c').replace(/Ć/g, 'C')
               .replace(/ę/g, 'e').replace(/Ę/g, 'E')
               .replace(/ł/g, 'l').replace(/Ł/g, 'L')
               .replace(/ń/g, 'n').replace(/Ń/g, 'N')
               .replace(/ó/g, 'o').replace(/Ó/g, 'O')
               .replace(/ś/g, 's').replace(/Ś/g, 'S')
               .replace(/ż/g, 'z').replace(/Ż/g, 'Z')
               .replace(/ź/g, 'z').replace(/Ź/g, 'Z');
}

module.exports = {
    findOne: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403);
        else {
            const quiz = await Quiz.findOne({_id: req.params.id});
            if(!quiz) return next();
            else return res.status(200).send(quiz);
        }
    },
    findAll: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403);
        else {
            const quizes = await Quiz.find(req.filters).sort({createdAt: "desc"});
            const perPage = 10;
            const quizesCount = quizes.length;

            const pageCount = Math.ceil(quizesCount/perPage);
            let page = parseInt(req.query.page);
                if(!page) page = 1;
                if(page > pageCount) page = pageCount;

            const from = page*perPage - perPage;
            const to = page*perPage;


            if(!quizes) return next();
            else return res.status(200).send({quizes: quizes.slice(from, to), page, pageCount});
        }
    },
    search: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403);
        else {
            const quizes = await Quiz.find(req.filters).sort({createdAt: "desc"});
            
            if(!quizes) return next();
            else {
                const found = new Array();
                const tags = req.params["tags"].toLowerCase().replace(/\,/g, ' ');


                quizes.forEach((quiz, index) => {
                    if(quiz.quizCategory != null || quiz.quizDesc != null || quiz.quizAuthor != null) {
                        const category =  quiz.quizCategory.escapeDiac().toLowerCase();
                        const desc = quiz.quizDesc.escapeDiac().toLowerCase();
                        const author = quiz.quizAuthor.escapeDiac().toLowerCase();
    
                        const categoryFind = category.includes(tags)
                        if(categoryFind) found.push(quiz);
                        else {
                            const descFind = desc.includes(tags);              
                            if(descFind) found.push(quiz);
                            else {
                                const authorFind = author.includes(tags);
                                if(authorFind) found.push(quiz);
                            }
                        }
                    }
                }); return res.status(200).send(found);
            } return res.status(404);
        }
    },
    create: async (req, res) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403);
        else {
            const quiz = await new Quiz({
                quizAuthor: req.body.quizAuthor,
                quizDesc: req.body.quizDesc,
                quizQuestions: req.body.quizQuestions,
                quizCategory: req.body.quizCategory,
                quizDuration: req.body.quizDuration,
                quizStartDate: req.body.quizStartDate,
                quizEndDate: req.body.quizEndDate,
                contributors: req.body.contributors,
                isActive: req.body.isActive,
                isPublic: req.body.isPublic,
                takes: req.body.takes,
                lastTake: req.body.lastTake
            }).save();

            return res.status(201).send(quiz);
        }
    },
    update: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403);
        else {
            const quiz = await Quiz.findOne({_id: req.params.id});
            if(!quiz) return next();

            if(req.body.quizAuthor) quiz.quizAuthor = req.body.quizAuthor;
            if(req.body.quizDesc) quiz.quizDesc = req.body.quizDesc;
            if(req.body.quizQuestions) quiz.quizQuestions = req.body.quizQuestions;
            if(req.body.quizCategory) quiz.quizCategory = req.body.quizCategory;
            if(req.body.quizDuration) quiz.quizDuration = req.body.quizDuration;
            if(req.body.quizStartDate) quiz.quizStartDate = req.body.quizStartDate;
            if(req.body.quizEndDate) quiz.quizEndDate = req.body.quizEndDate;
            if(req.body.contributors) quiz.contributors = req.body.contributors;
            if(req.body.isActive) quiz.isActive = req.body.isActive;
            if(req.body.isPublic) quiz.isPublic = req.body.isPublic;
            if(req.body.takes) quiz.takes = req.body.takes;
            if(req.body.lastTake) quiz.lastTake = req.body.lastTake;

            await quiz.save();
            return res.status(200).send(quiz);
        }
    },
    remove: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403);
        else {
            const quiz = await Quiz.findOne({_id: req.params.id});
            if(!quiz) return next();
            else await quiz.remove();

            return res.status(200);
        }
    }
};