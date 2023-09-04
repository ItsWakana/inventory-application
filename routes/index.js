var express = require('express');
var router = express.Router();
const { index } = require("../controllers/synthController");

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: "Sergio's Synthesizer Store" });
// });

router.get('/', index);

module.exports = router;
