/*--INFO--*/
// Author: Ceasar Bautista
// Contributors: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Date: 02/10/2020
// File: ./middlewares/groupBy.mid.js
/*-!INFO!-*/


// Originally posted by Ceasar Bautista on StackOverflow
// https://stackoverflow.com/a/34890276

module.exports = {
    groupBy: (xs, key) => (
        xs.reduce((rv, x) => {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {})
    )
};