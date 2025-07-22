
const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/send-email', emailController.sendEmail);
router.get('/authorize-payment', emailController.authorizePayment);

module.exports = router; 