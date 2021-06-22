const express = require("express");

const usersController = require("../controllers/user-controllers");

const router = express.Router();

router.get("/", usersController.getUsers);
router.post("/deleteusers", usersController.deleteUsers);
router.post("/blockusers", usersController.blockUsers);
router.post("/editusers", usersController.editUsers);

router.post("/register", usersController.signup);
router.post("/register/emailverify", usersController.emailverify);
router.post("/register/phoneverify", usersController.phoneverify);
router.post("/login", usersController.login);
router.post("/fblogin", usersController.fbLogin);

//CRUD USER
// router.post("/adduser", usersController.addUser);

router.post("/updateusername", usersController.updateUserUsername);
router.post("/updateimage", usersController.updateImage);
router.post("/updatepassword", usersController.updateUserPassword);
router.post("/savefavourite", usersController.saveFavourite);
router.post("/deletefavourite", usersController.deleteFavourite);

router.post("/getmessages", usersController.getMessages);

router.post("/searchactivity", usersController.getSearchActivity);

module.exports = router;
