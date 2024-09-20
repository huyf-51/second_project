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
        bookingId: DataTypes.STRING,
        amount: {
            type: DataTypes.BIGINT,
            validate: {
                min: 0,
            },
        },
        transactionDate: {
            allowNull: true,
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: false,
        sequelize,
        modelName: 'Payment',
    }
);

module.exports = Payment;
