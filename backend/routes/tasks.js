/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 31/10/2020
// File: ./routes/tasks.js
/*-!INFO!-*/


const router = require("express").Router();
const auth = require("../middlewares/auth.mid");

const err = require("../middlewares/errors.mid");
const {getFilters} = require("../middlewares/fillters/tasks.filter");
const tc = require("../controllers/tasks.controller");


router.get("/:id", err.catchAsync(tc.findOne));
router.get('/', getFilters, err.catchAsync(tc.findAll));
router.get("/render/:id", getFilters, err.catchAsync(tc.render));
router.get("/search/:tags", err.catchAsync(tc.search));

router.post("/add/", auth, err.catchAsync(tc.create));
router.post("/upload/", auth, err.catchAsync(tc.upload));

// router.options("/compile/:id", cors());
// router.options("/run/:id", cors());
// router.options("/check/:id", cors());

router.post("/compile/:id", err.catchAsync(tc.compile));
router.post("/run/:id", err.catchAsync(tc.run));
router.post("/check/:id", err.catchAsync(tc.check));
router.post("/:id/download/", auth, err.catchAsync(tc.download))

router.put("/update/:id", auth, err.catchAsync(tc.update));
router.put("/upload/", auth, err.catchAsync(tc.uploadUser));

router.delete("/remove/:id", err.catchAsync(tc.remove));
router.delete("/remove/:id/user/", err.catchAsync(tc.removeUser));
router.delete("/purge/:id", err.catchAsync(tc.purge));
router.delete("/purge/:id/user/", err.catchAsync(tc.purgeUser));

module.exports = router;