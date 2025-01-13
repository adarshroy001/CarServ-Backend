const express = require("express");
const router = express.Router();
const controller = require("../Controllers/servicesController.js");

router.get('/' , (req, res) => {
    res.status(200).json({ message: 'Hello from the API!' })
})


// create api to add logs for error pages 
router.post('/logperformance' , controller.logperformance);

//create api to add offers
router.post('/addoffer' , controller.addOffer);

//api to get offers by pageName
router.get('/getoffers/:pagename' , controller.getofferbypagename);


module.exports = router;