const express = require('express');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const router = express.Router();
require('dotenv').config();

// Load JWT secret from environment
const jwtSecret = process.env.JWT_SECRET;
const config = {
  user: 'helpdesk_admin',
  password: 'Helpdesk123!',
  server: 'localhost',
  port: 1433,
  database: 'test', // or whatever you named it
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};
// SQL Server connection config

// Maintain SQL connection pool
let pool;
async function getPool() {
  if (pool) {
    try {
      await pool.request().query('SELECT 1');
      return pool;
    } catch (err) {
      console.warn('🔁 Resetting SQL connection pool...');
      pool = null;
    }
  }
  pool = await sql.connect(config);
  console.log('✅ Connected to SQL Server');
  return pool;
}

// Login route (email + domain only)
router.post('/login', async (req, res) => {
  const { email, domain } = req.body;

  // Basic validation
  if (!email || !domain) {
    return res.status(400).json({ message: 'Email and domain are required' });
  }

  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input('email', sql.VarChar, email)
      .input('domain', sql.VarChar, domain)
      .query('SELECT * FROM ITUsers WHERE email = @email AND domain = @domain');

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.userid || null,
        psNumber: user.psNumber,
        name: user.name,
        email: user.email,
        domain: user.domain,
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    return res.json({ token });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
