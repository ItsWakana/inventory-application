const express = require("express");
const router = express.Router();
const { getSynthList, synthCreateGet, synthCreatePost } = require("../controllers/synthController");

router.get("/", getSynthList);

router.get("/create", synthCreateGet);

router.post("/create", synthCreatePost);

module.exports = router;