// routes/previouslySubmittedTickets.js
const express = require('express');
const sql = require('mssql');
const router = express.Router();

const config = {
  user: 'adminuser',
  password: 'BUR123ger@',
  server: 'supportserver123.database.windows.net',
  database: 'supportDB',
  options: { encrypt: true, trustServerCertificate: false }
};

let pool;
async function getPool() {
  if (pool) return pool;
  pool = await sql.connect(config);
  console.log("📌 Connected to Azure SQL (tickets)");
  return pool;
}





router.get('/', async (req, res) => {
  const { assignedTo } = req.query;
  if (!assignedTo) {
    return res.status(400).json({ error: 'Query parameter assignedTo is required' });
  }
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('assignedTo', sql.NVarChar, assignedTo)
      .query(`
        SELECT UniqueID AS id,
               domain,
               Type,
               RaisedBy AS psNumber,
               status AS currentStatus,
               Date AS createdAt,
               AssignedTo AS assignedTo,
               Priority AS priority,
               ResolutionDate,
               ResolutionTime,
               SLACompliance
        FROM alltickets_table
        WHERE AssignedTo = 'Alice Johnson'
        ORDER BY Date DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Failed to fetch tickets:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;
