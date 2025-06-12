{/*}
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
  const { description, domain, inputDetails, systemMessage } = req.body;

  // Validation
  if (!description || !domain) {
    return res.status(400).json({
      error: 'Missing required fields: Description and domain',
    });
  }

  // Simulated user data (fallback for testing)
  let psNumber = req.user?.psNumber || `PS${Math.floor(Math.random() * 100000)}`;
  let reportedBy = req.user?.name || ['Alice', 'Bob', 'Charlie', 'David'][Math.floor(Math.random() * 4)];

  try {
    const pool = await getPool();

    const result = await pool.request()
      .input('description', sql.NVarChar, description)
      .input('domain', sql.NVarChar, domain)
      .input('inputDetails', sql.NVarChar, inputDetails || '')
      .input('systemMessage', sql.NVarChar, systemMessage || '')
      .input('psNumber', sql.NVarChar, psNumber)
      .input('reportedBy', sql.NVarChar, reportedBy)
      .query(`
        INSERT INTO OldProblems (description, domain, inputDetails, systemMessage)
        VALUES (@description, @domain, @inputDetails, @systemMessage)
      `);

    res.status(200).json({ message: ' Problem reported successfully', result });
  } catch (err) {
    console.error('❌ Error inserting problem:', err);
    res.status(500).json({ error: 'Something went wrong while reporting the problem.' });
  }
});
router.get('/all', async (req, res) => {
  try {
    const pool = await getPool();
    console.log('🔍 Trying to fetch all problems...');

    const result = await pool.request()
      .query('SELECT * FROM OldProblems');

    console.log('✅ Problems fetched:', result.recordset);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching problems:', err);
    res.status(500).json({ error: 'Failed to fetch reported problems' });
  }
});

module.exports = router;
*/}

const express = require('express');
const sql = require('mssql');
const nodemailer = require('nodemailer');

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

// SQL pool reuse
let pool;
async function getPool() {
  if (pool) return pool;
  pool = await sql.connect(config);
  console.log('✅ Connected to Azure SQL');
  return pool;
}

// Route
router.post('/', async (req, res) => {
  const { description, domain, inputDetails, systemMessage, reportedBy, psNumber, email } = req.body;

  // Validate required fields
  if (!description || !domain || !reportedBy || !psNumber || !email) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Generate unique Problem ID
  const problemID = `RP${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    const pool = await getPool();

    // Insert into OldProblems
    await pool.request()
      .input('problemID', sql.VarChar, problemID)
      .input('description', sql.NVarChar, description)
      .input('domain', sql.NVarChar, domain)
      .input('inputDetails', sql.NVarChar, inputDetails || '')
      .input('systemMessage', sql.NVarChar, systemMessage || '')
      .input('reportedBy', sql.NVarChar, reportedBy)
      .input('psNumber', sql.NVarChar, psNumber)
      .input('email', sql.NVarChar, email)
      .query(`
        INSERT INTO OldProblems (
          problemID, description, domain, inputDetails, systemMessage, reportedBy, psNumber, email
        )
        VALUES (
          @problemID, @description, @domain, @inputDetails, @systemMessage, @reportedBy, @psNumber, @email
        )
      `);

    // Email acknowledgment
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'evakerenskyishere@gmail.com',         // replace with your Gmail
        pass: 'vaub huvm rggk scrt',      // use Gmail app password
      },
    });

    const mailOptions = {
      from: 'evakerenskyishere@gmail.com',
      to: email,
      subject: 'Problem Report Confirmation',
      text: `Thank you for reporting a problem. Your Problem ID is ${problemID}. We will get back to you shortly with a resolution!`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Problem reported successfully', problemID });
  } catch (err) {
    console.error('❌ Error:', err);
    return res.status(500).json({ error: 'Something went wrong while reporting the problem.' });
  }
});

module.exports = router;
