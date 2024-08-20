const verifySession = (req, res, next) => {
    const passengerId = req.session.passengerId;
    if (!passengerId) {
        return next(new Error('permission denied'));
    }
    req.id = passengerId;
    next();
};

module.exports = verifySession;
