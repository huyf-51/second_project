const Airport = require('../models/Airport');
const createError = require('http-errors');

const getAllAirport = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allAirport = await Airport.findAll({
                attributes: ['airportName', 'location'],
            });
            resolve(allAirport);
        } catch (error) {
            reject(new createError.InternalServerError(error));
        }
    });
};

const findFlight = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(data);
        } catch (error) {
            reject(new Error(error));
        }
    });
};

module.exports = { getAllAirport, findFlight };
