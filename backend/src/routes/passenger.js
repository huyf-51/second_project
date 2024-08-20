const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const passengerController = require('../controllers/PassengerController');
const verifySession = require('../middlewares/verifySession');

router.get(
    '/get-info',
    verifySession,
    catchError(passengerController.getPassengerInfo)
);

module.exports = router;
