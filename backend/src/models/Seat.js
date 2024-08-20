const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Seat extends Model {}

Seat.init(
    {
        seatId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        flightId: DataTypes.INTEGER,
        seatName: DataTypes.STRING,
        available: DataTypes.BOOLEAN,
        passengerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        timestamps: false,
        sequelize,
        modelName: 'Seat',
    }
);

module.exports = Seat;
