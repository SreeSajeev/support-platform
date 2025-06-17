{/*// routes/login.js
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
  if (pool) {
    try {
      await pool.request().query('SELECT 1');
      return pool;
    } catch (err) {
      console.warn('⚠️ Reconnecting to SQL Server...');
      await pool.close().catch(() => {});
      pool = null;
    }
  }

  try {
    pool = await sql.connect(config);
    console.log('✅ Connected to Azure SQL');
    return pool;
  } catch (err) {
    console.error('❌ Connection failed:', err);
    throw err;
  }
}


// Test route
router.get('/', (req, res) => {
  res.send('Login API is running!');
});


router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const pool = await getPool();

    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, password)
      .query(`
        SELECT psNumber, name, email
        FROM Users
        WHERE email = @email AND password = @password
      `);

    if (result.recordset.length === 0) {
      return res.status(401).send('Invalid credentials');
    }

    const user = result.recordset[0];
    return res.json(user);
    //return res.status(200).json({ message: 'Logged In successfully' });
  } catch (err) {
    console.error('X Error ',err);
    return res.status(500).send('Server error');
  }
});


module.exports = router;
*/}
// --- login.js (Local Login Route using Users table) ---
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


// Route to test connection
router.get('/', (req, res) => {
  res.send('🔐 Login route is live');
});

// Route to authenticate user
router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query(`SELECT userid, name, email, ps_number FROM Users WHERE email = @email`);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    return res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error('Login DB Error:', err);
    return res.status(500).json({ error: 'Database error during login' });
  }
});

module.exports = router;
