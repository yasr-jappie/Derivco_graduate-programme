const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import the blueprint we made earlier
const jwt = require('jsonwebtoken');

// @route   POST /api/auth/register
// @desc    Register a new developer account
router.post('/register', async (req, res) => {
    try {
        // 1. Extract the data sent by the user
        const { name, email, password, techStack } = req.body;

        // 2. Check if a user with this email already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // 3. Create a new user object
        user = new User({
            name,
            email,
            password,
            techStack
        });

        // 4. Hash (scramble) the password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 5. Save the user to MongoDB
        await user.save();

        // 6. Send a success response back
        res.status(201).json({ message: 'Developer account created successfully!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if the user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 2. Check if the password matches the scrambled password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 3. Create the payload (the data we want to put on the ID card)
        const payload = {
            user: {
                id: user.id
            }
        };

        // 4. Sign the token and send it back to the user
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }, // The token expires in 5 hours
            (err, token) => {
                if (err) throw err;
                res.json({ token, message: 'Logged in successfully!' });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;