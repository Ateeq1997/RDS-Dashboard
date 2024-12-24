const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const db = require('./firebaseConfig'); // Import Firebase config
const User = require('./User'); // Ensure you have your User model imported
const { generateToken } = require('./firebaseConfig'); // Import your token generation function

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors());

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password, role } = req.body;
    
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Check if the role matches
        if (user.role !== role) {
            return res.status(403).json({ message: "Invalid role" });
        }

        // Generate token if login is successful
        const token = generateToken(user); // Token generation function
        return res.status(200).json({ message: "Login successful", token, role: user.role });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

// Start server
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
