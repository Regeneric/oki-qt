/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 02/10/2020
// File: ./middlewares/filters/users.filter.js
/*-!INFO!-*/


const User = require("../../models/user.model");
const qs = require("qs");
const {_} = require("lodash");

module.exports = {
    getFilters: (req, res, next) => {
        const availableFilters = Object.keys(User.schema.paths);
        const filters = qs.parse(req.query);
        delete filters.api_key;

        req.filters = _.pickBy(filters, (value, key) => availableFilters.indexOf(key) >= -1);
        next();
    }
}