const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/BookingController');
const catchError = require('../utils/catchError');

router.get('/find-ticket/:id', catchError(bookingController.findTicket));
router.get('/payment-return', catchError(bookingController.paymentReturn));
router.post('/payment', catchError(bookingController.payment));
router.get('/checkin/:id', catchError(bookingController.checkin));
router.delete(
    '/cancel-booking/:id',
    catchError(bookingController.cancelBooking)
);
router;

module.exports = router;
