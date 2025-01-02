require('dotenv').config()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const redisClient = require('../common/redis');

const register = async (req, res) => {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
        return res.status(400).json({ status: false, message: 'All fields are required' });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ status: false, message: 'Invalid email format' });
    }

    if (password.length < 8) {
        return res.status(400).json({ status: false, message: 'Password must be at least 8 characters long' });
    }

    const validUserTypes = ['manager', 'employee', 'admin'];
    if (!validUserTypes.includes(userType)) {
        return res.status(400).json({ status: false, message: 'Invalid user type' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: false, message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword,
            userType
        });

        await newUser.save();

        res.status(200).json({ status: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Server error' });
    }
};



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ status: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ status: false, message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ status: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expiration time
        );

        res.send({
            status: true,
            message: "Login successful",
            token,
            user: {
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ status: false, message: "Internal server error" });
    }
};


const logout = async (req, res) => {
    console.log( req.headers, "req.headers")
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(400).send({ status: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add token to Redis blacklist with expiration
        const expiryTime = decoded.exp - Math.floor(Date.now() / 1000); // Remaining token lifetime
        console.log(expiryTime, "expiryTime")
        await redisClient.setEx(token, expiryTime, 'blacklisted');

        return res.status(200).send({ status: true, message: 'Logged out successfully' });
    } catch (error) {
        return res.status(400).send({ status: false, message: 'Invalid token or already logged out' });
    }
};



module.exports = {login, register,logout}