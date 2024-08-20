const passengerService = require('../services/PassengerService');

const getPassengerInfo = async (req, res) => {
    const passengerId = req.id;
    const info = await passengerService.getPassengerInfo(passengerId);
    res.status(200).json(info);
};

module.exports = { getPassengerInfo };
