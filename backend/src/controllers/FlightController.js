const flightService = require('../services/FlightService');

const getAllAirport = async (req, res) => {
    const allAirport = await flightService.getAllAirport();
    res.status(200).json(allAirport);
};

const findFlight = async (req, res) => {
    const data = await flightService.findFlight(req.body);
    console.log(data);
    res.status(200).json('ok');
};

module.exports = { getAllAirport, findFlight };
