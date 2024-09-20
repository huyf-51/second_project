const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const Payment = require('../models/Payment');

class Booking extends Model {}

Booking.init(
    {
        bookingId: {
            type: DataTypes.UUIDV4,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
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

Booking.hasOne(Payment, { foreignKey: 'bookingId' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

module.exports = Booking;
