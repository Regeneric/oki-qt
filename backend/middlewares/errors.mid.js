/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 02/10/2020
// File: ./middlewares/errors.mid.js
/*-!INFO!-*/


module.exports = {
    notFound: (req, res, next) => {
        const err = new Error("404 page not found");
        err.status = 404;
        next(err);
    },
    catchAsync: fn => {
        return (req, res, next) => {
            fn(req, res, next).catch(err => next(err));
        };
    }
};