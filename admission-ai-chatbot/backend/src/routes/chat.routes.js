const express = require("express");

const {
    chat
} = require("../controllers/chat.controller");


const router = express.Router();


// ========================================
// CHATBOT
// ========================================

router.post(
    "/",
    chat
);


module.exports = router;