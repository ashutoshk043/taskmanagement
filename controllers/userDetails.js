
const User = require('../models/user')

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const user = await User.findById(userId).select({password:0});

        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found' });
        }

        res.send({
            status: true,
            message: 'User profile retrieved successfully',
            user,
        });
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        res.status(500).send({ status: false, message: 'Internal server error' });
    }
};


module.exports = {getUserProfile };