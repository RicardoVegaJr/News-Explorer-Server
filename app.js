require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const usersRouter = require('./routes/users');

const { PORT = 3001, MONGODB_URI = 'mongodb://127.0.0.1:27017/newsrv' } = process.env;

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// DB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((e) => console.error('MongoDB connection error:', e.message));

// Health check (handy for Postman)
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Routes
app.use('/api/users', usersRouter);

// 404 fallback
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});