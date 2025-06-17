{/*// --- Import Required Packages ---
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
    origin: 'https://sg9w2ksj-8080.inc1.devtunnels.ms',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://sg9w2ksj-8080.inc1.devtunnels.ms");
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
const ProblemsRoutes = require('./routes/problem');
const TicketSummaryRoutes = require('./routes/ticketsummary');
const ITPerformanceRoutes = require('./routes/itperformance');
const TicketDetailsRoutes = require('./routes/ticketdetails');
const TicketResponseRoutes = require('./routes/response');
const UserIDRoutes = require('./routes/userid');
const PreviousTicketRoutes = require('./routes/previouslysubmittedtickets');
const loginRoutes = require('./routes/login');
const SearchRoutes = require('./routes/search');


app.use('/api/report-problem', reportProblemRoute);
app.use('/api/helpdesk-view', itHelpdeskRoutes);
app.use('/api/clarification',ClarificationRoutes);
app.use('/api/change-requests', changeRequestsRoutes);
app.use('/api/problems', ProblemsRoutes);
app.use('/api/ticket-summary', TicketSummaryRoutes);
app.use('/api/it-performance', ITPerformanceRoutes);
app.use('/api/ticket-details', TicketDetailsRoutes);
app.use('/api/ticket-responses', TicketResponseRoutes);
app.use('/api/userid', UserIDRoutes);
app.use('/api/previously-submitted-tickets',  PreviousTicketRoutes);
app.use('/api/login', loginRoutes); 
app.use('/api/search', SearchRoutes);  
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
*/}
// --- index.js (Updated for Local SQL + Login Route) ---
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Routes
const AuthRoutes = require('./routes/auth');
const loginRoutes = require('./routes/login');
const reportProblemRoute = require('./routes/reportProblem');
const ClarificationRoutes = require('./routes/clarification');
const changeRequestsRoutes = require('./routes/changerequest');
const itHelpdeskRoutes = require('./routes/ithelpdeskview');
const TicketSummaryRoutes = require('./routes/ticketsummary');
const ITPerformanceRoutes = require('./routes/itperformance');
const TicketDetailsRoutes = require('./routes/ticketdetails');
const TicketResponseRoutes = require('./routes/response');
const PreviousTicketRoutes = require('./routes/previouslysubmittedtickets');
const UserIDRoutes = require('./routes/userid');

app.use('/api/previously-submitted-tickets',  PreviousTicketRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/report-problem', reportProblemRoute);
app.use('/api/clarification', ClarificationRoutes);
app.use('/api/change-requests', changeRequestsRoutes);
app.use('/api/helpdesk-view', itHelpdeskRoutes);
app.use('/api/ticket-summary', TicketSummaryRoutes);
app.use('/api/it-performance', ITPerformanceRoutes);
app.use('/api/ticket-details', TicketDetailsRoutes);
app.use('/api/ticket-responses', TicketResponseRoutes);
app.use('/api/userid', UserIDRoutes);
app.use('/api/auth', AuthRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Support Platform Backend Running');
});

app.listen(port, () => {
  console.log(`🟢 Server running on port ${port}`);
});
