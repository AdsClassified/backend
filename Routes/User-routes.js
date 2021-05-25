const express = require("express");

const usersController = require("../controllers/user-controllers");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post("/register", usersController.signup);
router.post("/register/emailverify", usersController.emailverify);
router.post("/register/phoneverify", usersController.phoneverify);
router.post("/login", usersController.login);

//CRUD USER
// router.post("/adduser", usersController.addUser);

router.post("/updateusername", usersController.updateUserUsername);
router.post("/updatepassword", usersController.updateUserPassword);
router.post("/savefavourite", usersController.saveFavourite);
router.post("/deletefavourite", usersController.deleteFavourite);

module.exports = router;
