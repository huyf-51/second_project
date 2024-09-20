const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const flightController = require('../controllers/FlightController');

router.get('/get-all-airport', catchError(flightController.getAllAirport));
router.post('/find', catchError(flightController.findFlight));
router.post('/booking', catchError(flightController.bookingFlight));

module.exports = router;
