const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const catchError = require('../utils/catchError');

router.post('/login', catchError(authController.login));
router.post('/signup', catchError(authController.signup));
router.post('/logout', catchError(authController.logout));

module.exports = router;
