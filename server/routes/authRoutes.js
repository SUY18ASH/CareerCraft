const express = require('express');
const { registerUser, loginUser, getProfile, updateProfile } = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);


module.exports = router;
// This code defines an Express router for authentication routes in a Node.js application. 
// It imports the necessary modules and the authentication controller functions for user registration and login. 
// The router defines two POST routes: one for user registration and another for user login, which are linked to their respective controller functions. 
// Finally, the router is exported for use in other parts of the application.
