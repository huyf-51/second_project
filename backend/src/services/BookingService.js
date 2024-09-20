const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Passenger = require('../models/Passenger');
const Flight = require('../models/Flight');
const Airport = require('../models/Airport');
const Seat = require('../models/Seat');
const createError = require('http-errors');
const config = require('config');
const querystring = require('qs');
const crypto = require('crypto-js');
const Hex = require('crypto-js/enc-hex');
const moment = require('moment');
const sortObject = require('../utils/sortObject');
const { sequelize } = require('../config/db');
const axios = require('axios');

const payment = (data, req) => {
    return new Promise(async (resolve, reject) => {
        try {
            process.env.TZ = 'Asia/Ho_Chi_Minh';

            let date = new Date();
            let createDate = moment(date).format('YYYYMMDDHHmmss');

            let ipAddr =
                req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            let tmnCode = config.get('vnp_TmnCode');
            let secretKey = config.get('vnp_HashSecret');
            let vnpUrl = config.get('vnp_Url');
            let returnUrl = config.get('vnp_ReturnUrl');
            let payment = await Payment.findOne({
                where: {
                    paymentId: data.paymentId,
                },
                attributes: ['paymentId', 'amount'],
            });
            if (!payment) {
                reject(new createError.NotFound('booking not found'));
            }
            let bankCode = data.bankCode;

            let locale = data.language;
            if (locale === null || locale === '') {
                locale = 'vn';
            }
            let currCode = 'VND';
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = payment.paymentId;
            vnp_Params['vnp_OrderInfo'] =
                'Thanh toan cho ma GD:' + payment.paymentId;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = payment.amount * 100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            if (bankCode !== null && bankCode !== '') {
                vnp_Params['vnp_BankCode'] = bankCode;
            }

            vnp_Params = sortObject(vnp_Params);

            let signData = querystring.stringify(vnp_Params, { encode: false });
            let hmac = crypto.HmacSHA512(signData, secretKey);
            let signed = Hex.stringify(hmac);
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl +=
                '?' + querystring.stringify(vnp_Params, { encode: false });

            resolve(vnpUrl);
        } catch (error) {
            reject(new createError.InternalServerError(error));
        }
    });
};

const paymentReturn = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let vnp_Params = req.query;

            let secureHash = vnp_Params['vnp_SecureHash'];
            const paymentId = vnp_Params['vnp_TxnRef'];
            const transactionDate = vnp_Params['vnp_PayDate'];

            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            vnp_Params = sortObject(vnp_Params);

            let secretKey = config.get('vnp_HashSecret');

            let signData = querystring.stringify(vnp_Params, { encode: false });
            let hmac = crypto.HmacSHA512(signData, secretKey);
            let signed = Hex.stringify(hmac);

            if (secureHash === signed) {
                const booking = await Booking.findOne({
                    include: [
                        {
                            model: Payment,
                            where: {
                                paymentId,
                            },
                        },
                    ],
                });
                booking.paymentStatus = true;
                await booking.save();
                await Payment.update(
                    { transactionDate },
                    { where: { paymentId } }
                );
                resolve({ code: '00' });
            } else {
                resolve({ code: '97', paymentId });
            }
        } catch (error) {
            reject(new createError.InternalServerError(error));
        }
    });
};

const findTicket = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ticket = await Booking.findOne({
                include: [
                    { model: Payment, attributes: ['paymentId'] },
                    {
                        model: Passenger,
                        attributes: ['firstName', 'lastName'],
                        include: [{ model: Seat, attributes: ['passengerId'] }],
                    },
                    {
                        model: Flight,
                        include: [
                            {
                                model: Airport,
                                as: 'destinationAirport',
                                attributes: ['location', 'airportName'],
                            },
                            {
                                model: Airport,
                                as: 'originAirport',
                                attributes: ['location', 'airportName'],
                            },
                        ],
                        attributes: ['departureDateTime', 'arrivalDateTime'],
                    },
                ],
                where: {
                    bookingId: data,
                },
                attributes: {
                    exclude: ['passengerId'],
                },
            });
            resolve(ticket);
        } catch (error) {
            reject(new createError.InternalServerError(error));
        }
    });
};

const checkin = (flightId) => {
    return new Promise(async (resolve, reject) => {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        try {
            const flight = await Flight.findByPk(flightId, {
                attributes: ['departureDateTime'],
            });
            const departureDate = new Date(flight.departureDateTime);
            const dateNow = new Date(Date.now());
            const duration = departureDate - dateNow;

            if (duration <= 3600 * 1000 * 24) {
                resolve({ checkin: true });
            } else {
                resolve({ checkin: false });
            }
        } catch (error) {
            reject(new createError.InternalServerError(error));
        }
    });
};

const cancelBooking = (bookingId, req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const booking = await Booking.findOne({ where: { bookingId } });
            let dataObj;
            let vnp_Api;
            if (booking?.paymentStatus) {
                process.env.TZ = 'Asia/Ho_Chi_Minh';
                let date = new Date();

                let vnp_TmnCode = config.get('vnp_TmnCode');
                let secretKey = config.get('vnp_HashSecret');
                vnp_Api = config.get('vnp_Api');
                const payment = await Payment.findOne({ where: { bookingId } });

                let vnp_TxnRef = payment.paymentId;
                let vnp_TransactionDate = payment.transactionDate;

                let vnp_Amount = (payment.amount * 100) / 2; // huy ve tru 50% tien ve
                let vnp_TransactionType = '03'; // hoan tien 1 phan

                const passenger = await Passenger.findOne({
                    include: [{ model: Booking, where: { bookingId } }],
                });
                let vnp_CreateBy = passenger.firstName;

                let vnp_RequestId = moment(date).format('HHmmss');
                let vnp_Version = '2.1.0';
                let vnp_Command = 'refund';
                let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;

                let vnp_IpAddr =
                    req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;

                let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

                let vnp_TransactionNo = '0';

                let data =
                    vnp_RequestId +
                    '|' +
                    vnp_Version +
                    '|' +
                    vnp_Command +
                    '|' +
                    vnp_TmnCode +
                    '|' +
                    vnp_TransactionType +
                    '|' +
                    vnp_TxnRef +
                    '|' +
                    vnp_Amount +
                    '|' +
                    vnp_TransactionNo +
                    '|' +
                    vnp_TransactionDate +
                    '|' +
                    vnp_CreateBy +
                    '|' +
                    vnp_CreateDate +
                    '|' +
                    vnp_IpAddr +
                    '|' +
                    vnp_OrderInfo;
                let hmac = crypto.HmacSHA512(data, secretKey);
                let vnp_SecureHash = Hex.stringify(hmac);

                dataObj = {
                    vnp_RequestId: vnp_RequestId,
                    vnp_Version: vnp_Version,
                    vnp_Command: vnp_Command,
                    vnp_TmnCode: vnp_TmnCode,
                    vnp_TransactionType: vnp_TransactionType,
                    vnp_TxnRef: vnp_TxnRef,
                    vnp_Amount: vnp_Amount,
                    vnp_TransactionNo: vnp_TransactionNo,
                    vnp_CreateBy: vnp_CreateBy,
                    vnp_OrderInfo: vnp_OrderInfo,
                    vnp_TransactionDate: vnp_TransactionDate,
                    vnp_CreateDate: vnp_CreateDate,
                    vnp_IpAddr: vnp_IpAddr,
                    vnp_SecureHash: vnp_SecureHash,
                };
            }

            await sequelize.transaction(async (t) => {
                const ticket = await Booking.findOne({
                    where: {
                        bookingId,
                    },
                    attributes: ['passengerId'],
                    transaction: t,
                });
                await Payment.destroy({
                    where: {
                        bookingId,
                    },
                    transaction: t,
                });
                await Booking.destroy({ where: { bookingId }, transaction: t });
                await Passenger.destroy({
                    where: { passengerId: ticket.passengerId },
                    transaction: t,
                });

                if (booking?.paymentStatus) {
                    const res = await axios.post(vnp_Api, dataObj);
                    if (res.data.vnp_ResponseCode !== '00') {
                        throw new createError.InternalServerError(
                            'refund fail'
                        );
                    }
                }
            });
            resolve('cancel success');
        } catch (error) {
            reject(new createError.InternalServerError(error));
        }
    });
};

module.exports = { findTicket, checkin, payment, paymentReturn, cancelBooking };
