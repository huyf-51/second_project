const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const Payment = require('../models/Payment');

class Booking extends Model {}

Booking.init(
    {
        bookingId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        flightId: DataTypes.INTEGER,
        paymentStatus: DataTypes.BOOLEAN,
        passengerId: DataTypes.INTEGER,
    },
    {
        timestamps: false,
        sequelize,
        modelName: 'Booking',
    }
);

Booking.hasOne(Payment);
Payment.belongsTo(Booking);

module.exports = Booking;
