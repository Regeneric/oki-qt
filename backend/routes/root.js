/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 31/10/2020
// File: ./routes/root.js
/*-!INFO!-*/


const router = require("express").Router();
const rc = require("../controllers/root.controller");


router.get("/", rc.showInfo);
router.post("/", rc.showInfo);
router.put("/", rc.showInfo);
router.delete("/", rc.showInfo);

module.exports = router;