const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Payment extends Model {}

Payment.init(
    {
        paymentId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        bookingId: DataTypes.INTEGER,
        amount: {
            type: DataTypes.BIGINT,
            validate: {
                min: 0,
            },
        },
    },
    {
        timestamps: true,
        sequelize,
        modelName: 'Payment',
        updatedAt: false,
        createdAt: 'transactionDateTime',
    }
);

module.exports = Payment;
