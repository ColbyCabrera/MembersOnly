var express = require('express');
var router = express.Router();
const home_controller = require("../controllers/home");


router.get('/', (req, res, next) => {
    res.redirect("/home");
});

/* GET home page. */
router.get('/home', home_controller.index);

// POST for sign up form
router.get('/sign_in', home_controller.sign_in_get);

// POST for sign up form
router.post('/sign_in', home_controller.sign_in_post);

// POST for sign up form
router.get('/sign_up', home_controller.sign_up_get);

// POST for sign up form
router.post('/sign_up', home_controller.sign_up_post);

router.get("/logout", home_controller.logout_get);

router.get("/messages", home_controller.messages_get);

router.get("/messages_create", home_controller.messages_create_get);

router.post("/messages_create", home_controller.messages_create_post);

module.exports = router;