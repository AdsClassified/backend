const express = require("express");

const conversationController = require("../controllers/conversation-controllers");

const router = express.Router();

router.post("/", conversationController.getConversation);
router.post("/add", conversationController.addConversation);
// router.post("/delete", popupController.deletePopup);
// router.post("/edit", popupController.editPopup);

module.exports = router;
