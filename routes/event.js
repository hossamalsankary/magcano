const express = require('express');
const router =  express.Router();

//require the controlers 
 const {
    event,
    streamevent,
    resetdata,
    addexpectations,
    userExpections
} = require('../controllers/event');

//job main route
router.route("/").get(event);
router.route("/expectations").post(addexpectations);
router.route("/userExpections").get(userExpections);
router.route("/next").get(streamevent);
router.route("/resetdata").delete(resetdata);
//the main post requist

//export router
module.exports = router;

