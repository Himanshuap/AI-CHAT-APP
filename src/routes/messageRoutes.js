const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { messageSchema } = require('../validators/schemas');
const { sendMessage, getMessages } = require('../controllers/messageController');

const router = express.Router();

router.use(auth);

router.post('/', validate(messageSchema), sendMessage);
router.get('/', getMessages);

module.exports = router;