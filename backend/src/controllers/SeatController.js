const seatService = require('../services/SeatService');

const getAllSeats = async (req, res) => {
    const data = await seatService.getAllSeats(req.params.id);
    res.status(200).json(data);
};

const chooseSeat = async (req, res) => {
    const data = await seatService.chooseSeat(req.params.id, req.body);
    res.status(200).json(data);
};

module.exports = { getAllSeats, chooseSeat };
