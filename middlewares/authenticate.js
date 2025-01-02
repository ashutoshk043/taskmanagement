require('dotenv').config()
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).send({ status: false, message: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({ status: false, message: 'Unauthorized: Invalid token' });
    }
};


module.exports = {authenticate}