const Airport = require('../models/Airport');
const Flight = require('../models/Flight');
const Passenger = require('../models/Passenger');
const Seat = require('../models/Seat');

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
    const seat = await Seat.create(req.body);
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

module.exports = {
    createFlight,
    createAirport,
    getFlight,
    createSeat,
    findAllSeatFromFlight,
    updateSeat,
    findPassengerBySeat,
};
