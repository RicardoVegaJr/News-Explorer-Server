const express = require('express');
const { auth, getCurrentUser, createUser, login, updateProfile } = require('../controllers/users');

const router = express.Router();

// Public
router.post('/signup', createUser);
router.post('/login', login);

// Protected
router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, updateProfile);

module.exports = router;