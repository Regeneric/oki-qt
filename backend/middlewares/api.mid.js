/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 09/11/2020
// File: ./middlewares/errors.mid.js
/*-!INFO!-*/

const qs = require("qs");

module.exports = {
    key: (req, res, next) => {
        const queries = qs.parse(req.query);

        if(queries.api_key !== process.env.API_KEY && (req.get("host") == "---" || req.get("host") == "---")) {
            return res.status(403).redirect(301, "https://oki.org.pl/");
        } else next();
    }
};
