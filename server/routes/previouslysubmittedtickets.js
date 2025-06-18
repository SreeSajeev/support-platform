// routes/previouslySubmittedTickets.js
const express = require('express');
const sql = require('mssql');
const router = express.Router();

const config = {
  user: 'helpdesk_admin',
  password: 'Helpdesk123!',
  server: 'localhost',
  port: 1433,
  database: 'test',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};

let pool;
async function getPool() {
  try {
    if (pool) {
      await pool.request().query('SELECT 1');
      return pool;
    }
    pool = await sql.connect(config);
    console.log('Connected to SQL');
    return pool;
  } catch (err) {
    console.error('❌ SQL connection failed:', err.message);
    pool = null;
    throw err;
  }
}

// ✅ Route using JOIN to match RaisedBy = name WHERE email matches
router.get('/', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Query parameter email is required' });
  }

  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input('email', sql.NVarChar, email)
      .query(`
        SELECT t.UniqueID, t.Type, t.Status, t.Date, t.Domain, t.RaisedBy
        FROM AllTickets t
        JOIN users u ON t.RaisedBy = u.name
        WHERE u.email = @email
        ORDER BY t.Date DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Failed to fetch tickets:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;
