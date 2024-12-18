const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./signupapp.json'); // Ensure this path is correct

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://signupapp-24917-default-rtdb.firebaseio.com/',
});

// Signup route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password before storing it
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
        username,
        email,
        password: hashedPassword,
        role: 'User', // Assign a default role, adjust as needed
    };

    // Save the new user to Firebase
    try {
        await admin.database().ref('users').push(newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Signin route
app.post('/signin', async (req, res) => {
    console.log("Signin attempt:", req.body); // Log the incoming request body

    const { username, password } = req.body;

    try {
        // Fetch user data from the database
        const snapshot = await admin.database().ref('users').orderByChild('username').equalTo(username).once('value');

        if (!snapshot.exists()) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const userData = snapshot.val();
        const userKey = Object.keys(userData)[0]; // Get the first key (user ID)
        const user = userData[userKey];

        // Compare hashed password
        const match = bcrypt.compareSync(password, user.password);
        if (match) {
            res.status(200).json({
                message: 'Login successful',
                role: user.role, // Only send the user's role back, not the password
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ message: 'Error during sign-in' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
