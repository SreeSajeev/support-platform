const express = require('express');
const router = express.Router();
const sql = require('mssql');

// DB config
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

// POST /api/report-problem
router.post('/', async (req, res) => {
  console.log('📥 Clarification POST route called');
  console.log('Request body:', req.body);

  const { problemDescription, domain, problemStatement, attachmentPath } = req.body;

  if (!problemDescription || !domain) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await sql.connect(config);

    await pool.request()
      .input('problemDescription', sql.NVarChar, problemDescription)
      .input('domain', sql.NVarChar, domain)
      .input('problemStatement', sql.NVarChar, problemStatement)
      .input('attachmentPath', sql.NVarChar, attachmentPath)
      .query(`INSERT INTO clarification (ProblemDescription, Domain, ProblemStatement, AttachmentPath) 
              VALUES (@problemDescription, @domain, @problemStatement, @attachmentPath)`);

    await pool.close();

    res.json({ message: 'Clarification Ticket submitted successfully' });
  } catch (err) {
    console.error('DB insert error:', err);
    res.status(500).json({ error: 'Failed to save clarification ticket' });
  }
});

// Health check endpoint
router.get('/', (req, res) => {
  res.send('✅ Clarification endpoint is live and reachable via GET');
});

module.exports = router;
