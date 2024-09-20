const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const Booking = require('../models/Booking');
const Seat = require('../models/Seat');

class Flight extends Model {}

Flight.init(
    {
        flightId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        departureDateTime: DataTypes.DATE,
        arrivalDateTime: {
            type: DataTypes.DATE,
            validate: {
                isGreaterThanDepartureDateTime(value) {
                    if (value <= this.departureDateTime) {
                        throw new Error(
                            'arrivalDateTime must be greater than arrivalDateTime'
                        );
                    }
                },
            },
        },
        destinationAirportCode: DataTypes.INTEGER,
        originAirportCode: DataTypes.INTEGER,
        availableSeats: DataTypes.BIGINT,
        price: DataTypes.BIGINT,
    },
    {
        timestamps: false,
        sequelize,
        modelName: 'Flight',
    }
);

Flight.hasMany(Seat, {
    foreignKey: 'flightId',
});
Seat.belongsTo(Flight, {
    foreignKey: 'flightId',
});

Flight.hasMany(Booking, {
    foreignKey: 'flightId',
});
Booking.belongsTo(Flight, {
    foreignKey: 'flightId',
});

module.exports = Flight;
