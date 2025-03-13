const express = require('express');
const router = express.Router();
const ChatbotController = require('./../app/controllers/ChatController');

router.get('/test',ChatbotController.get);

module.exports = router;
