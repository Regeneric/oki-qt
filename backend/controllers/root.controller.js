/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 31/10/2020
// File: ./controllers/questions.controller.js
/*-!INFO!-*/


module.exports = {
    showInfo: async (req, res) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403);
        else return res.status(403);
    }
};