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
  origin: 'https://reimagined-space-eureka-q7qrj6xwwx6qcxpjr-8080.app.github.dev',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://reimagined-space-eureka-q7qrj6xwwx6qcxpjr-8080.app.github.dev");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

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
const ClarificationRoutes = require('./routes/clarification');
const changeRequestsRoutes = require('./routes/changerequest');

app.use('/api/report-problem', reportProblemRoute);
app.use('/api/helpdesk-view', itHelpdeskRoutes);
app.use('/api/clarification',ClarificationRoutes);
app.use('/api/change-requests', changeRequestsRoutes);

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
