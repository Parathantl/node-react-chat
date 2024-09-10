const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, 'your_jwt_secret', { expiresIn: '30d' });
};

// User registration
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ username, email, password });
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// User login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Search users
exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.query;
        const loggedInUserId = req.user._id;  // Get the logged-in user's ID from the request (set by the protect middleware)

        // Find users whose username matches the query, but exclude the logged-in user
        const users = await User.find({
            username: { $regex: query, $options: 'i' },  // Case-insensitive search on username
            _id: { $ne: loggedInUserId }  // Exclude the logged-in user by ID
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error searching users' });
    }
};
