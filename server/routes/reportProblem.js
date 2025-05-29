const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Azure SQL database config
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
    console.log('Connected to Azure SQL');
    return pool;
  } catch (err) {
    console.error('❌ Failed to connect to DB:', err);
    throw err;
  }
}

// Test GET route
router.get('/', (req, res) => {
  res.send('📡 Report Problem API is working!');
});

// POST route to report a problem
router.post('/', async (req, res) => {
  const { problemDescription, domain, inputDetails, systemMessage } = req.body;

  // Validation
  if (!problemDescription || !domain) {
    return res.status(400).json({
      error: 'Missing required fields: problemDescription and domain',
    });
  }

  // Simulated user data (fallback for testing)
  let psNumber = req.user?.psNumber || `PS${Math.floor(Math.random() * 100000)}`;
  let reportedBy = req.user?.name || ['Alice', 'Bob', 'Charlie', 'David'][Math.floor(Math.random() * 4)];

  try {
    const pool = await getPool();

    const result = await pool.request()
      .input('description', sql.NVarChar, problemDescription)
      .input('domain', sql.NVarChar, domain)
      .input('inputDetails', sql.NVarChar, inputDetails || '')
      .input('systemMessage', sql.NVarChar, systemMessage || '')
      .input('psNumber', sql.NVarChar, psNumber)
      .input('reportedBy', sql.NVarChar, reportedBy)
      .query(`
        INSERT INTO Problems (description, domain, inputDetails, systemMessage, psNumber, reportedBy)
        VALUES (@description, @domain, @inputDetails, @systemMessage, @psNumber, @reportedBy)
      `);

    res.status(200).json({ message: ' Problem reported successfully', result });
  } catch (err) {
    console.error('❌ Error inserting problem:', err);
    res.status(500).json({ error: 'Something went wrong while reporting the problem.' });
  }
});
// GET all reported problems
/*router.get('/all', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query('SELECT * FROM Problems ORDER BY createdAt DESC'); // Assuming Problems table has a createdAt column

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching problems:', err);
    res.status(500).json({ error: 'Failed to fetch reported problems' });
  }
});
*/
router.get('/all', async (req, res) => {
  try {
    const pool = await getPool();
    console.log('🔍 Trying to fetch all problems...');

    const result = await pool.request()
      .query('SELECT * FROM Problems');

    console.log('✅ Problems fetched:', result.recordset);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching problems:', err);
    res.status(500).json({ error: 'Failed to fetch reported problems' });
  }
});



module.exports = router;
