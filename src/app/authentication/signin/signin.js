const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./signup/signupapp.json');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://signupapp-24917-default-rtdb.firebaseio.com/',
});

// Signin route
app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    console.log("Login request received for username:", username);

    try {
        const snapshot = await admin.database().ref('users').orderByChild('username').equalTo(username.trim()).once('value');
        
        if (!snapshot.exists()) {
            console.log("No user found with username:", username);
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const userData = snapshot.val();
        const userKey = Object.keys(userData)[0];
        const user = userData[userKey];

        console.log("User found with username:", user.username);
        
        // Compare password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("Password mismatch for user:", user.username);
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        console.log("Login successful for user:", user.username);
        res.status(200).json({
            message: 'Login successful',
            role: user.role
        });

    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ message: 'Error during sign-in' });
    }
});

// Start your Express server (optional)
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
