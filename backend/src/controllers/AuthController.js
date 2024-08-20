const authService = require('../services/AuthService');

const login = async (req, res) => {
    const userData = await authService.findPassenger(req.body);
    req.session.passengerId = userData.id;
    res.status(200).json(userData);
};

const signup = async (req, res) => {
    const { status } = await authService.createPassenger(req.body);
    res.status(200).json(status);
};

const logout = async (req, res) => {
    await authService.destroySession(req.session);
    res.status(204);
};

module.exports = { login, signup, logout };
