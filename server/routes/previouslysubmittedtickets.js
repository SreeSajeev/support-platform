// routes/previouslySubmittedTickets.js
const express = require('express');
const sql = require('mssql');
const router = express.Router();

const config = {
  user: 'helpdesk_admin', // or your SQL user
  password: 'Helpdesk123!', // your password
  server: 'localhost',       // no \SQLEXPRESS
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
      // Check if connection is still active
      await pool.request().query('SELECT 1');
      return pool;
    }
    pool = await sql.connect(config);
    console.log('Connected to SQL');
    return pool;
  } catch (err) {
    console.error('❌ SQL connection failed:', err.message);
    pool = null; // Reset if it's broken
    throw err;
  }
}
router.get('/', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Query parameter email is required' });
  }

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query(`
        SELECT 
          UniqueID AS id,
          domain,
          Type,
          Email AS email,
          status AS currentStatus,
          Date AS createdAt,
          AssignedTo AS assignedTo,
          Priority AS priority,
          ResolutionDate,
          ResolutionTime,
          SLACompliance
        FROM AllTickets
        WHERE Email = @email
        ORDER BY Date DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Failed to fetch tickets:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});



module.exports = router;
