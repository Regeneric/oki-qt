/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 16/10/2020
// File: ./controllers/questions.controller.js
/*-!INFO!-*/

const Question = require("../models/question.model");

module.exports = {
    check: async (req, res) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403);
        else {
            let question = null;
            const result = new Array();
    
            let cnt = 0;
            req.body.forEach(async q => {
                question = await Question.findOne({id: q.id});
                cnt++;

                console.log(question.id);
                console.log(question.qstBody);
                console.log(question.correctAnswers);
    
                if(q.checked !== null && !q.isOpen) {
                    if(q.checked.length === 1) if(q.checked[0] == question.correctAnswers) result.push({question, isCorrect: true});
                    if(q.checked.length > 1) {
                        q.checked = q.checked.sort();
                        question.correctAnswers = question.correctAnswers.sort();
    
                        let cnt = 0;
                        for(let i = 0; i != q.checked.length; ++i)
                            if(q.checked[i] == question.correctAnswers[i]) cnt++;
                        
                        if(cnt == q.checked.length) result.push({question, isCorrect: true}); 
                    }
                } if(q.isOpen) {
                    if(question.correctAnswers.length === 1) if(q.openAns.answer == question.correctAnswers) result.push({question, isCorrect: true});
    
                    // let cnt = 0;
                    // for(let i = 0; i != question.correctAnswers.length; ++i) {
                    //     console.log(question.correctAnswers[i], q.openAns[i].answer);
                    //     if(q.openAns[i].answer == question.correctAnswers[i]) cnt++;
                    // }
    
                } else result.push({question, isCorrect: false});
    
                if(cnt >= req.body.length) return res.status(201).send(result);
            });
        }
    }
};