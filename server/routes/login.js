// routes/login.js
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
