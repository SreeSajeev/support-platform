const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Azure SQL config
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

// Reuse connection pool
let pool;
async function getPool() {
  if (pool) return pool;
  try {
    pool = await sql.connect(config);
    console.log('Connected to Azure SQL (IT Helpdesk View)');
    return pool;
  } catch (err) {
    console.error('❌ Failed to connect to DB:', err);
    throw err;
  }
}

// Test route
router.get('/', (req, res) => {
  res.send('🛠️ IT Helpdesk View API is running!');
});

// GET route to fetch tickets (with optional filtering)
router.get('/tickets', async (req, res) => {
  try {
    const { issueType, psNumber, status } = req.query;

    const pool = await getPool();
    let query = 'SELECT * FROM Tickets WHERE 1=1';
    
    if (issueType) query += ` AND issueType = @issueType`;
    if (psNumber) query += ` AND psNumber = @psNumber`;
    if (status) query += ` AND status = @status`;

    const request = pool.request();
    if (issueType) request.input('issueType', sql.NVarChar, issueType);
    if (psNumber) request.input('psNumber', sql.NVarChar, psNumber);
    if (status) request.input('status', sql.NVarChar, status);

    const result = await request.query(query + ' ORDER BY createdAt DESC');

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching tickets:', err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

module.exports = router;
