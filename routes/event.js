const express = require('express');
const router =  express.Router();

//require the controlers 
 const {
    event,
    streamevent,
    gameweeks,
    addexpectations,
    userExpections
} = require('../controllers/event');

//job main route
router.route("/").get(event);
router.route("/expectations").post(addexpectations);
router.route("/userExpections").get(userExpections);
router.route("/next").get(streamevent);
router.route("/gameweeks").get(gameweeks);
//the main post requist

//export router
module.exports = router;

