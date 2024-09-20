const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const Booking = require('../models/Booking');
const Seat = require('../models/Seat');

class Passenger extends Model {}

Passenger.init(
    {
        passengerId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        phoneNumber: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
            },
        },
        firstName: DataTypes.STRING,
        nationalIDCard: DataTypes.STRING,
        point: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        },
        password: DataTypes.STRING,
    },
    {
        timestamps: false,
        sequelize,
        modelName: 'Passenger',
    }
);

Passenger.hasMany(Booking, { foreignKey: 'passengerId' });
Booking.belongsTo(Passenger, { foreignKey: 'passengerId' });

Passenger.hasOne(Seat, {
    foreignKey: 'passengerId',
});
Seat.belongsTo(Passenger, {
    foreignKey: 'passengerId',
});

module.exports = Passenger;
