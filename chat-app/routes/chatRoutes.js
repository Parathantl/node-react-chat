const express = require('express');
const { getMessages, getAllUserChats, findOrCreateChat, createMessage } = require('../controllers/chatController');

const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getAllUserChats); 
router.post('/findOrCreateChat', protect, findOrCreateChat);
router.post('/send', protect, createMessage);
router.get('/:chatId/messages', getMessages);


module.exports = router;
