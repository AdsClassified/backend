const express = require("express");

const adController = require("../controllers/ad-controllers");

const router = express.Router();

router.get("/getads", adController.getAds);
router.get("/getactiveads", adController.getActiveAds);
router.get("/countads", adController.countAds);
router.get("/adsstats", adController.adsStats);
router.post("/getad", adController.getAd);

router.post("/getuserads", adController.getUserAds);

//ADD AD
router.post("/", adController.placeAd);
router.post("/deletead", adController.deleteAd);
router.post("/deleteads", adController.deleteAds);
router.post("/activead", adController.activeAd);
router.post("/featureadrequest", adController.featureAdRequest);
router.post("/soldad", adController.soldAd);
router.post("/editad", adController.editAd);
router.post("/getfavourites", adController.getFavourites);
router.post("/getadsbylocation", adController.getAdsByLocation);
router.post("/getadsbycategories", adController.getAdsByCategories);

//Search
router.post("/search", adController.search);

//Message
router.post("/sendmessage", adController.sendMessage);

//Admin
router.post("/rejectads", adController.rejectAds);
router.post("/approveads", adController.approveAds);

router.post("/activeads", adController.activeAds);
router.post("/deactiveads", adController.deActiveAds);

router.post("/sendemail", adController.sendEmail);
router.post("/sendemailMulti", adController.sendEmail);

router.get("/getfeatureads", adController.getFeatureAds);
router.post("/getfeaturead", adController.getFeatureAd);
router.get("/countfeatureads", adController.countFeatureAds);
router.get("/getfeatureadsrequests", adController.getFeatureAdsRequests);
router.get("/getadsapproval", adController.getAdsApproval);
router.get("/countfeatureadsrequests", adController.countFeatureAdsRequests);
router.post("/makefeaturead", adController.makeFeatureAd);
router.post("/removefeaturead", adController.removeFeatureAd);
router.post("/deletefeatureads", adController.deleteFeatureAds);

module.exports = router;
