/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 16/10/2020
// File: ./routes/quizes.js
/*-!INFO!-*/


const router = require("express").Router();
const auth = require("../middlewares/auth.mid");

const err = require("../middlewares/errors.mid");
const {getFilters} = require("../middlewares/fillters/quizes.filter");
const qc = require("../controllers/quizes.controller");


router.get("/:id", err.catchAsync(qc.findOne));
router.get('/', getFilters, err.catchAsync(qc.findAll));
router.get("/search/:tags", err.catchAsync(qc.search));
router.post("/add/", auth, err.catchAsync(qc.create));
router.put("/update/:id", auth, err.catchAsync(qc.update));
router.delete("/remove/:id", auth, err.catchAsync(qc.remove));

module.exports = router;