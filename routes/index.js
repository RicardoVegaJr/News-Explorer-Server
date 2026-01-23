const express = require('express');

const usersRouter = require('./users');

const router = express.Router();

// Health check at /api/health
router.get('/health', (req, res) => res.json({ ok: true }));

// Users routes at /api/users/...
router.use('/users', usersRouter);

module.exports = router;