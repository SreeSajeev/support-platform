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

// GET route to fetch all tickets from the view
router.get('/tickets', async (req, res) => {
  try {
    const pool = await getPool();
    const query = `SELECT * FROM AllTickets ORDER BY Date DESC`;
    const result = await pool.request().query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching tickets:', err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

module.exports = router;
