const express = require("express");
const router = express.Router();
const { getSynthList, synthCreateGet } = require("../controllers/synthController");

router.get("/", getSynthList);

router.get("/create", synthCreateGet);
module.exports = router;