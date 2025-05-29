// --- Import Required Packages ---
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const app = express();

// --- Server Configuration ---
const port = process.env.PORT || 5000;

// --- SQL Server Configuration ---
const config = {
  user: 'adminuser',
  password: 'BUR123ger@',
  server: 'supportserver123.database.windows.net',
  database: 'supportDB',
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

// --- Middleware ---
app.use(cors({
  origin: 'https://reimagined-space-eureka-q7qrj6xwwx6qcxpjr-8080.app.github.dev', // allow frontend
}));
app.use(express.json()); // for parsing JSON bodies

// --- Test SQL Connection on Startup ---
async function testSqlConnection() {
  try {
    const pool = await sql.connect(config);
    console.log('✅ Connected to SQL Server successfully!');
    await pool.close(); // close test connection
  } catch (err) {
    console.error('❌ Failed to connect to SQL Server:', err);
  }
}
testSqlConnection();

// --- Import and Use Routes ---
const reportProblemRoute = require('./routes/reportProblem');
const itHelpdeskRoutes = require('./routes/ithelpdeskview');

app.use('/api/report-problem', reportProblemRoute);
app.use('/api/helpdesk-view', itHelpdeskRoutes);

// --- Root Route (For Quick Test) ---
app.get('/', (req, res) => {
  res.send('🚀 Welcome to the Support Platform Backend API!');
});

// --- Catch-all 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// --- Optional Debug Route (can be removed in production) ---
app.post('/api/debug-report-problem', async (req, res) => {
  console.log('📥 Debug - Received request body:', req.body);
  res.json({ message: 'Debug - Received test problem' });
});

// --- Start Server ---
app.listen(port, '0.0.0.0', () => {
  console.log(`🟢 Server is listening on port ${port}`);
});
