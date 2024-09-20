const authRouter = require('./auth');
const testRouter = require('./test');
const flightRouter = require('./flight');
const passengerRouter = require('./passenger');
const bookingRouter = require('./booking');
const seatRouter = require('./seat');

const initRoutes = (app) => {
    app.use('/auth', authRouter);
    app.use('/', testRouter);
    app.use('/flight', flightRouter);
    app.use('/passenger', passengerRouter);
    app.use('/booking', bookingRouter);
    app.use('/seat', seatRouter);
};

module.exports = initRoutes;
