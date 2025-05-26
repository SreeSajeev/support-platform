// index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Root route - when you open http://localhost:5000/
app.get('/', (req, res) => {
  res.send('Welcome to the Support Platform Backend API!');
});

// Sample route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Server is running 🎉' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});

