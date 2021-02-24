/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 16/10/2020
// File: ./config/mongodb.config.js
/*-!INFO!-*/


module.exports = {
    url: process.env.DB_URL || "mongodb://localhost:27017/quiz-oki",
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
};