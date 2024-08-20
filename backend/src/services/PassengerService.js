const Passenger = require('../models/Passenger');
const createError = require('http-errors');

const getPassengerInfo = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const info = await Passenger.findOne({
                where: { passengerId: id },
                attributes: {
                    exclude: ['password'],
                },
            });
            if (!info) {
                reject(new createError.NotFound('passenger not found'));
            }
            resolve(info);
        } catch (error) {
            reject(new createError.InternalServerError(error));
        }
    });
};

module.exports = { getPassengerInfo };
