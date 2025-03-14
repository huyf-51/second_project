const Passenger = require('../models/Passenger');
const bcrypt = require('bcrypt');
const createError = require('http-errors');

const createPassenger = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { password } = data;
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);
            await Passenger.create({
                ...data,
                password: hashPassword,
            });
            resolve({ status: 'success' });
        } catch (error) {
            reject(new createError.BadRequest(error));
        }
    });
};

const findPassenger = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { phoneNumber, password } = data;
            const account = await Passenger.findOne({ where: { phoneNumber } });
            if (!account) {
                reject(new createError.Unauthorized('account not found'));
            }
            const result = await bcrypt.compare(password, account.password);
            if (!result) {
                reject(new createError.Unauthorized('wrong password'));
            }
            resolve({ id: account.dataValues.passengerId });
        } catch (error) {
            reject(new createError.Unauthorized(error));
        }
    });
};

const destroySession = (session) => {
    return new Promise((resolve, reject) => {
        session.destroy((error) => {
            if (error) {
                reject(new createError.BadRequest(error));
            }
            resolve();
        });
    });
};

module.exports = {
    createPassenger,
    findPassenger,
    destroySession,
};
