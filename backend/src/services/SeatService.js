const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const Seat = require('../models/Seat');
const createError = require('http-errors');

const getAllSeats = (bookingId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const booking = await Booking.findOne({
                where: { bookingId },
            });
            const allSeats = await Seat.findAll({
                include: [
                    {
                        model: Flight,
                        where: { flightId: booking.flightId },
                        attributes: [],
                    },
                ],
                attributes: ['seatId', 'seatName', 'available'],
            });
            resolve(allSeats);
        } catch (error) {
            reject(new createError.InternalServerError(error));
        }
    });
};

const chooseSeat = (bookingId, seat) => {
    return new Promise(async (resolve, reject) => {
        try {
            const booking = await Booking.findOne({ where: { bookingId } });
            await Seat.update(
                { passengerId: booking.passengerId, available: false },
                {
                    where: {
                        seatId: seat.seatId,
                        flightId: booking.flightId,
                    },
                }
            );
            resolve('success');
        } catch (error) {
            reject(new createError.InternalServerError(error));
        }
    });
};

module.exports = { getAllSeats, chooseSeat };
