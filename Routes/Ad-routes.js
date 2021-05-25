const express = require("express");

const adController = require("../controllers/ad-controllers");

const router = express.Router();

router.get("/getads", adController.getAds);
router.post("/getad", adController.getAd);

router.post("/getuserads", adController.getUserAds);

//ADD AD
router.post("/", adController.placeAd);
router.post("/deletead", adController.deleteAd);
router.post("/activead", adController.activeAd);
router.post("/editad", adController.editAd);
router.post("/getfavourites", adController.getFavourites);

//Search
router.post("/search", adController.search);

//Message
router.post("/sendmessage", adController.sendMessage);

module.exports = router;
