const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true,
        enum: ['manager', 'employee', 'admin'],
        message: '{VALUE} is not a valid user type' 
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
