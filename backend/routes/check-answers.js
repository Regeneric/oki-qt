/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 22/10/2020
// File: ./routes/check-answers.js
/*-!INFO!-*/


const router = require("express").Router();

const err = require("../middlewares/errors.mid");
const ac = require("../controllers/check-answers.controller");

router.post("/check/", err.catchAsync(ac.check));

module.exports = router;