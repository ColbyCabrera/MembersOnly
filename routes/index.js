var express = require('express');
var router = express.Router();
const home_controller = require("../controllers/home");

router.get('/', (req, res, next) => {
    res.redirect("/home");
});

router.get('/home', home_controller.index);

router.get('/sign_in', home_controller.sign_in_get);

router.post('/sign_in', home_controller.sign_in_post);

router.get('/sign_up', home_controller.sign_up_get);

router.post('/sign_up', home_controller.sign_up_post);

router.get("/logout", home_controller.logout_get);

router.get("/secret", home_controller.secret_get);

router.post("/secret", home_controller.secret_post);

router.get("/messages_create", home_controller.messages_create_get);

router.post("/messages_create", home_controller.messages_create_post);

router.post("/message/:id/delete", home_controller.message_delete_post);

module.exports = router;