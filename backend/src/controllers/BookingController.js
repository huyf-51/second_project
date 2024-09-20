const bookingService = require('../services/BookingService');

const payment = async (req, res) => {
    const paymentUrl = await bookingService.payment(req.body, req);
    res.status(200).json(paymentUrl);
};

const findTicket = async (req, res) => {
    const data = await bookingService.findTicket(req.params.id);
    res.status(200).json(data);
};

const checkin = async (req, res) => {
    const data = await bookingService.checkin(req.params.id);
    res.status(200).json(data);
};

const paymentReturn = async (req, res) => {
    const data = await bookingService.paymentReturn(req);
    if (data.code === '00') {
        res.redirect(`${process.env.CLIENT_URL}/payment-success`);
    } else if (data.code === '97') {
        res.redirect(
            `${process.env.CLIENT_URL}/payment/${data.paymentId}?msg=transaction failed`
        );
    }
};

const cancelBooking = async (req, res) => {
    const data = await bookingService.cancelBooking(req.params.id, req);
    res.status(200).json(data);
};

module.exports = { payment, findTicket, checkin, paymentReturn, cancelBooking };
