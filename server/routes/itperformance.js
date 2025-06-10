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
    console.log('Connected to Azure SQL (IT Performance Dashboard)');
    return pool;
  } catch (err) {
    console.error('❌ Failed to connect to DB:', err);
    throw err;
  }
}

// Test route
router.get('/', (req, res) => {
  res.send('📊 IT Performance Dashboard API is running!');
});

// GET KPIs route for dashboard metrics
router.get('/metrics', async (req, res) => {
  try {
    const pool = await getPool();
    // Calculate metrics from alltickets_table
    const query = `
  SELECT 
    UniqueID AS TicketID,
    Priority,
    ResolutionTime,
    SLACompliance,
    AssignedTo,
    Status,
    CAST(Date AS VARCHAR) as Date
  FROM alltickets_table
  WHERE ResolutionTime IS NOT NULL
  ORDER BY Date DESC
`;


    const result = await pool.request().query(query);
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Error fetching metrics:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

// GET route to fetch all tickets, with optional filters for status and assignedTo

router.get('/tickets', async (req, res) => {
  try {
    const pool = await getPool();
    const query = `
      SELECT 
        UniqueID, -- if available
        Priority,
        ResolutionTime,
        SLACompliance,
        AssignedTo,
        Status,
        CAST(Date AS VARCHAR) as Date
      FROM alltickets_table
      WHERE ResolutionTime IS NOT NULL
      ORDER BY Date DESC
    `;
    const result = await pool.request().query(query);
    console.log(`✅ Returned ${result.recordset.length} tickets`);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching tickets:', err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});


module.exports = router;

