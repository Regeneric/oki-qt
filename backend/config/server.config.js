/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 16/10/2020
// File: ./config/server.config.js
/*-!INFO!-*/


require("dotenv").config();
module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 1337,
    address: process.env.ADDRESS || "---"
};
