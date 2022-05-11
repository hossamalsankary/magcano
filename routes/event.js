const express = require('express');
const router =  express.Router();

//require the controlers 
 const {
    event,
    resetdata,
    addexpectations,
    userExpections,
    searching
} = require('../controllers/event');

//job main route
router.route("/").get(event);
router.route("/searching").get(searching);
router.route("/expectations").post(addexpectations);
router.route("/userExpections").get(userExpections);
router.route("/resetdata").delete(resetdata);
//the main post requist

//export router
module.exports = router;

