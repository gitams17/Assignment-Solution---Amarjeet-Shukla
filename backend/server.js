const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const logRoutes = require('./routes/logs');
const { basicAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Authentication Middleware for all API routes [cite: 217]
app.use('/api', basicAuth);

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/logs', logRoutes);

// Global Error Handler [cite: 231]
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});