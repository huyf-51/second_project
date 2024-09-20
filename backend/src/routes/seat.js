const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const seatController = require('../controllers/SeatController');

router.get('/get-all-seats/:id', catchError(seatController.getAllSeats));
router.post('/choose-seat/:id', seatController.chooseSeat);

module.exports = router;
