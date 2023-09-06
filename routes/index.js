var express = require('express');
var router = express.Router();
const { index } = require("../controllers/synthController");

router.get('/', index);

module.exports = router;
