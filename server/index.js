const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Import routes
app.use('/api', require('./routes/reportProblem'));
app.use('/api', require('./routes/clarification'));
app.use('/api', require('./routes/changeRequest'));
app.use('/api', require('./routes/tickets'));
app.use('/api', require('./routes/downloads'));
app.use('/api', require('./routes/escalation'));
app.use('/api', require('./routes/login'));

// Root welcome
app.get('/', (req, res) => {
  res.send('Welcome to the Support Platform Backend API!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
