const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const flightController = require('../controllers/FlightController');

router.get('/get-all-airport', catchError(flightController.getAllAirport));
router.post('/find', catchError(flightController.findFlight));

module.exports = router;
