const Airport = require('../models/Airport');
const Flight = require('../models/Flight');
const Passenger = require('../models/Passenger');
const Seat = require('../models/Seat');
const Booking = require('../models/Booking');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const config = require('config');

const createFlight = async (req, res) => {
    await Flight.create(req.body);
    res.json('ok');
};

const createAirport = async (req, res) => {
    await Airport.create(req.body);
    res.json('ok');
};

const getFlight = async (req, res) => {
    const flight = await Flight.findOne({
        include: [
            { model: Airport, as: 'destinationAirport' },
            { model: Airport, as: 'originAirport' },
        ],
    });
    const airport = await Airport.findOne({
        include: {
            model: Flight,
            as: 'destination',
        },
    });
    res.json(airport);
};

const createSeat = async (req, res) => {
    setTimeout(async () => {
        const seat = await Seat.create(req.body);
    }, 10000);

    res.json('ok');
};

const findAllSeatFromFlight = async (req, res) => {
    const allSeat = await Seat.findAll({
        where: {
            flightId: req.params.id,
        },
        include: Flight,
    });
    res.json(allSeat);
};

const updateSeat = async (req, res) => {
    const { passengerId, seatId, flightId } = req.body;
    await Seat.update(
        { available: true, passengerId: passengerId },
        {
            where: {
                seatId: seatId,
                flightId: flightId,
            },
        }
    );
    res.json('ok');
};

const findPassengerBySeat = async (req, res) => {
    const pass = await Seat.findAll({
        // where: {
        //     flightId: req.params.flightId,
        //     seatId: req.params.seatId,
        // },
        include: {
            model: Passenger,
            right: true,
        },
    });

    res.json(pass);
};

const deleteAllFlight = async (req, res) => {
    await Flight.destroy({ truncate: true });
    res.json('ok');
};

const createBooking = async (req, res) => {
    await Booking.create({ flightId: 2, paymentStatus: true, passengerId: 1 });
    res.json('ok');
};

const test = async (req, res) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GOOGLE_APP_EMAIL,
            pass: process.env.GOOGLE_APP_PASSWORD,
        },
    });
    await transporter.sendMail(
        {
            to: 'dgh2003lqm@gmail.com',
            subject: 'test',
            html: `<div>hello</div>`,
        },
        (error, infor) => {
            if (error) {
                console.log(error);
            } else {
                console.log(infor.response);
            }
        }
    );
    res.json('oke');
};

const createSeats = async (req, res) => {
    for (let i = 1; i <= 40; i++) {
        await Seat.create({
            flightId: 5,
            seatName: `${i}F`,
            available: false,
        });
    }
    res.json('ok');
};

const testConfig = (req, res) => {
    res.json(config.get('vnp_TmnCode'));
};

module.exports = {
    createFlight,
    createAirport,
    getFlight,
    createSeat,
    findAllSeatFromFlight,
    updateSeat,
    findPassengerBySeat,
    deleteAllFlight,
    createBooking,
    test,
    createSeats,
    testConfig,
};
