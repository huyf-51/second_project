const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const Seat = require('../models/Seat');
const createError = require('http-errors');
const redlock = require('../config/redlock');

const redis = require('../config/redis').getRedisInstance('redis://127.0.0.1:6379')
const redisClient = redis.getRedisClient()

let relockClient

redisClient.on('connect', async () => {
    const redlockInstance = redlock.getRedlockInstance()
    relockClient = redlockInstance.getRedlockClient()
})

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
            const lock = await relockClient.acquire([`seat:${seat.seatId}:lock`], 5000)
            const availableSeat = await Seat.findOne({where: { seatId: seat.seatId}, attributes: ['available']})
            if (!availableSeat.available) {
                await lock.release()
                return resolve('seat is not available')
            }
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
            _io.emit('set seat', seat.seatId)
            await lock.release()
            resolve('success');
        } catch (error) {
            reject(new createError.InternalServerError(error));
        }
    });
};

module.exports = { getAllSeats, chooseSeat };
