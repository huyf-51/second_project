const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const Flight = require('../models/Flight');

class Airport extends Model {}

Airport.init(
    {
        airportCode: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        location: DataTypes.STRING,
        airportName: DataTypes.STRING,
    },
    {
        timestamps: false,
        sequelize,
        modelName: 'Airport',
    }
);

Airport.hasMany(Flight, {
    foreignKey: 'destinationAirportCode',
    as: 'destination',
});
Flight.belongsTo(Airport, {
    foreignKey: 'destinationAirportCode',
    as: 'destinationAirport',
});

Airport.hasMany(Flight, {
    foreignKey: 'originAirportCode',
    as: 'origin',
});
Flight.belongsTo(Airport, {
    foreignKey: 'originAirportCode',
    as: 'originAirport',
});

module.exports = Airport;
