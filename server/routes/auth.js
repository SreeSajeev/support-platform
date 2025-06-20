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
  },
};

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

// Login route (email + domain)
router.post('/login', async (req, res) => {
  const { email, domain } = req.body;

  if (!email || !domain) {
    return res.status(400).json({ message: 'Email and domain are required' });
  }

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .input('domain', sql.VarChar, domain)
      .query('SELECT * FROM ITUsers WHERE email = @email AND domain = @domain');

    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Return user info directly (not secure, for internal use only)
    return res.json({
      
      token: user.name, // Just for now
      psNumber: user.psNumber,
      name: user.name,
      email: user.email,
      domain: user.domain
    });

  } catch (err) {
    console.error('❌ Login error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
