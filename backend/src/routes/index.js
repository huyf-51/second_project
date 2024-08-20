const authRouter = require('./auth');
const testRouter = require('./test');
const flightRouter = require('./flight');
const passengerRouter = require('./passenger');

const initRoutes = (app) => {
    app.use('/auth', authRouter);
    app.use('/', testRouter);
    app.use('/flight', flightRouter);
    app.use('/passenger', passengerRouter);
};

module.exports = initRoutes;
