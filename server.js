const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const searchRoutes = require('./routes/searchRoutes');
const rateLimitMiddleware = require('./middlewares/rateLimitMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(rateLimitMiddleware);

// Database Connection
mongoose.connect(process.env.MONGODB_URI);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notes', noteRoutes);
app.use('/api/v1/search', searchRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
