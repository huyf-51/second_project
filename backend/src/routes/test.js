const express = require('express');
const router = express.Router();
const verifySession = require('../middlewares/verifySession');
const catchError = require('../utils/catchError');
const testController = require('../controllers/TestController');

router.get('/', verifySession);
router.post('/create-flight', catchError(testController.createFlight));
router.post('/create-airport', catchError(testController.createAirport));
router.get('/get-flight', catchError(testController.getFlight));
router.post('/create-seat', catchError(testController.createSeat));
router.get(
    '/find-all-seat-from-flight/:id',
    catchError(testController.findAllSeatFromFlight)
);
router.patch('/update-seat', testController.updateSeat);
router.get(
    '/find-passenger-by-seat/:seatId/:flightId',
    catchError(testController.findPassengerBySeat)
);

module.exports = router;
