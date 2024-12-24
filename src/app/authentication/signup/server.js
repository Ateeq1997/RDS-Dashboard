const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('../signupapp.json'); // Ensure this path is correct

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://signupapp-24917-default-rtdb.firebaseio.com/',
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Signup route
app.post('/signup', async (req, res) => {
    const { username, email, password, role } = req.body;

    // Hash the password before storing it
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
        username,
        email,
        password: hashedPassword,
        role,
    };

    // Determine the path based on the role
    let userPath = 'users';
    if (role === 'doctor') {
        userPath = 'doctors'; // Store in 'doctors' table
    } else if (role === 'patient') {
        userPath = 'patients'; // Store in 'patients' table
    }
    // Add more roles as needed...

    // Save the new user to Firebase
    try {
        await admin.database().ref(userPath).push(newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});
