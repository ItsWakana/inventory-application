const express = require("express");
const router = express.Router();
const { getSynthList } = require("../controllers/synthController");

router.get("/", getSynthList);

module.exports = router;