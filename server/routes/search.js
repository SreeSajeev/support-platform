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
    console.log('Connected to Azure SQL (Search Issue)');
    return pool;
  } catch (err) {
    console.error('❌ Failed to connect to DB:', err);
    throw err;
  }
}

// POST route to search tickets
router.post('/', async (req, res) => {
  console.log('📥 SEARCH POST route called');
  const { problemDescription, year, psNumber, searchAreas } = req.body;

  if (!problemDescription) {
    return res.status(400).json({ error: 'Problem description is required.' });
  }

  try {
    const pool = await getPool();

    // Dynamically build WHERE clause based on selected checkboxes
    const whereClauses = [];
    const request = pool.request();

    if (searchAreas.subject) {
      whereClauses.push("Subject LIKE @desc");
    }
    if (searchAreas.transaction) {
      whereClauses.push("Transaction LIKE @desc");
    }
    if (searchAreas.inputData) {
      whereClauses.push("InputData LIKE @desc");
    }
    if (searchAreas.systemError) {
      whereClauses.push("SystemError LIKE @desc");
    }
    if (searchAreas.responseThread) {
      whereClauses.push("ResponseThread LIKE @desc");
    }
    if (searchAreas.issueNumber) {
      whereClauses.push("IssueNumber LIKE @desc");
    }

    let whereQuery = whereClauses.length > 0 ? `(${whereClauses.join(' OR ')})` : '';
    if (year) {
      whereQuery += ` AND Year = @year`;
      request.input('year', sql.VarChar, year);
    }
    if (reporterId) {
      whereQuery += ` AND psNumber = @psNumber`;
      request.input('psNumber', sql.VarChar, psNumber);
    }

    request.input('desc', sql.VarChar, `%${problemDescription}%`);

    const finalQuery = `
      SELECT * FROM alltickets_table
      WHERE ${whereQuery || '1=1'} 
      ORDER BY Date DESC
    `;

    const result = await request.query(finalQuery);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('❌ Error searching tickets:', err);
    res.status(500).json({ error: 'Failed to search tickets' });
  }
});

module.exports = router;
