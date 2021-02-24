/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 16/10/2020
// File: ./routes/users.js
/*-!INFO!-*/


const router = require("express").Router();
const passport = require("passport");

const err = require("../middlewares/errors.mid");
const {getFilters} = require("../middlewares/fillters/users.filter");
const uc = require("../controllers/users.controller");


router.get("/:id", err.catchAsync(uc.findOne));
router.get('/', getFilters, err.catchAsync(uc.findAll));
router.post("/add/", err.catchAsync(uc.create));
router.post("/check/", passport.authenticate("local", {session: false}), err.catchAsync(uc.check));
router.post("/forgot/", err.catchAsync(uc.forgot));
router.put("/update/:id", err.catchAsync(uc.update));
router.delete("/remove/:id", err.catchAsync(uc.remove));

module.exports = router;