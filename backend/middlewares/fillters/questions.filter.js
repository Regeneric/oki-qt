/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 16/10/2020
// File: ./middlewares/filters/questions.filter.js
/*-!INFO!-*/


const Question = require("../../models/question.model");
const qs = require("qs");
const {_} = require("lodash");

module.exports = {
    getFilters: (req, res, next) => {
        const availableFilters = Object.keys(Question.schema.paths);
        const filters = qs.parse(req.query);
        delete filters.api_key;

        req.filters = _.pickBy(filters, (value, key) => availableFilters.indexOf(key) >= -1);
        next();
    }
}