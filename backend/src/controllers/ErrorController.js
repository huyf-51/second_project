module.exports = (err, req, res, next) => {
    console.log(err.stack);
    console.log(err.message);
    res.status(err.status).json(err.message);
};
