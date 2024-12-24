const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("../signupapp.json");
const jwt = require('jsonwebtoken');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://signupapp-24917-default-rtdb.firebaseio.com/"
});


function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
}
const db = admin.database();
module.exports = db;
