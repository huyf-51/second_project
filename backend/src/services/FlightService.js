const Airport = require('../models/Airport');
const createError = require('http-errors');
const Flight = require('../models/Flight');
const { Op } = require('sequelize');
const Passenger = require('../models/Passenger');
const bcrypt = require('bcrypt');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const { sequelize } = require('../config/db');

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
            const { originAirport, destinationAirport, departureDate } = data;
            const allFlight = await Flight.findAll({
                where: {
                    departureDateTime: {
                        [Op.startsWith]: departureDate,
                    },
                },
                attributes: {
                    exclude: ['originAirportCode', 'destinationAirportCode'],
                },
                include: [
                    {
                        model: Airport,
                        as: 'destinationAirport',
                        where: {
                            airportName: destinationAirport.split(' - ')[0],
                            location: destinationAirport.split(' - ')[1],
                        },
                    },
                    {
                        model: Airport,
                        as: 'originAirport',
                        where: {
                            airportName: originAirport.split(' - ')[0],
                            location: originAirport.split(' - ')[1],
                        },
                    },
                ],
            });
            resolve(allFlight);
        } catch (error) {
            reject(new createError.InternalServerError(error));
        }
    });
};

const bookingFlight = (data, userId) => {
    return new Promise(async (resolve, reject) => {
        let passenger, booking, payment;
        const { passengerInfo, price, point, flightId } = data;
        try {
            await sequelize.transaction(async (t) => {
                const hashPassword = await bcrypt.hash(
                    passengerInfo.nationalIDCard,
                    10
                );
                passenger = await Passenger.create(
                    {
                        ...passengerInfo,
                        password: hashPassword,
                    },
                    { transaction: t }
                );
                if (userId && point !== 0) {
                    await Passenger.decrement(
                        { point },
                        { where: { passengerId: userId }, transaction: t }
                    );
                }
                booking = await Booking.create(
                    {
                        flightId,
                        paymentStatus: false,
                        passengerId: passenger.passengerId,
                    },
                    { transaction: t }
                );
                payment = await Payment.create(
                    {
                        bookingId: booking.bookingId,
                        amount: price,
                    },
                    { transaction: t }
                );
                await Flight.decrement(
                    { availableSeats: 1 },
                    { where: { flightId }, transaction: t }
                );
            });
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.GOOGLE_APP_EMAIL,
                    pass: process.env.GOOGLE_APP_PASSWORD,
                },
            });
            transporter.sendMail(
                {
                    to: passenger.email,
                    subject: 'Notify for the payment of ticket',
                    html: `<div>
                        <p>If you do not pay for the ticket, we will cancel it one day after booking.</p>
                        <b>Your booking code: ${booking.bookingId}</b>
                    </div>`,
                },
                (error, infor) => {
                    if (error) {
                        console.log(error);
                    }
                }
            );
            const date = new Date(Date.now() + 1000 * 3600 * 24);
            const job = schedule.scheduleJob(date, async function () {
                const bookingAfter = await Booking.findByPk(booking.bookingId);
                if (bookingAfter.paymentStatus === false) {
                    try {
                        await sequelize.transaction(async (t) => {
                            await Payment.destroy({
                                where: { paymentId: payment.paymentId },
                                transaction: t,
                            });
                            await Booking.destroy({
                                where: { bookingId: bookingAfter.bookingId },
                                transaction: t,
                            });
                            await Passenger.destroy({
                                where: { passengerId: passenger.passengerId },
                                transaction: t,
                            });
                            if (userId && point !== 0) {
                                await Passenger.increment(
                                    { point },
                                    {
                                        where: { passengerId: userId },
                                        transaction: t,
                                    }
                                );
                            }
                        });
                        transporter.sendMail(
                            {
                                to: passenger.email,
                                subject: 'Notify for the payment of ticket',
                                html: `<div>
                                    <p>Your ticket has been canceled because you did not make the payment after 1 day.</p>
                                </div>`,
                            },
                            (error, infor) => {
                                if (error) {
                                    console.log(error);
                                }
                            }
                        );
                    } catch (error) {
                        console.log('delete booking when not payed>>>', error);
                    }
                }
                job.cancel();
            });
            resolve(payment.paymentId);
        } catch (error) {
            reject(new createError.InternalServerError(error));
        }
    });
};

module.exports = {
    getAllAirport,
    findFlight,
    bookingFlight,
};
