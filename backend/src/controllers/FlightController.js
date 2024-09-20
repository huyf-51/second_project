const flightService = require('../services/FlightService');

const getAllAirport = async (req, res) => {
    const allAirport = await flightService.getAllAirport();
    res.status(200).json(allAirport);
};

const findFlight = async (req, res) => {
    const data = await flightService.findFlight(req.body);
    res.status(200).json(data);
};

const bookingFlight = async (req, res) => {
    const data = await flightService.bookingFlight(req.body);

    res.status(200).json(data);
};

module.exports = { getAllAirport, findFlight, bookingFlight };
