var express = require('express');
var router = express.Router();
const home_controller = require("../controllers/home");


/* GET home page. */
router.get('/home', home_controller.index);

// POST for sign up form
router.post('/sign_up', home_controller.sign_up);

module.exports = router;