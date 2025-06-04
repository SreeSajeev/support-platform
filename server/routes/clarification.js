const express = require('express');
const router = express.Router();
const sql = require('mssql');

// DB config - keep consistent with your working config
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

// POST /api/change-requests
router.post('/', async (req, res) => {
  console.log('📥 Change Request POST route called');
  console.log('Request body:', req.body);

  const {
    requestedBy,
    date,
    contactDetails,
    email,
    attachmentPath,
    problemStatement,
    currentMethod,
    proposedNewProcess,
    expectedOutcome,
    benefits,
    consequences,
    functionHeadEmail,
  } = req.body;

  // Basic validation
  if (!requestedBy || !date || !problemStatement) {
    return res.status(400).json({ error: 'Please provide requestedBy, date, and problemStatement.' });
  }

  try {
    const pool = await sql.connect(config);

    await pool.request()
      .input('requestedBy', sql.NVarChar, requestedBy)
      .input('date', sql.Date, date)
      .input('contactDetails', sql.NVarChar, contactDetails || null)
      .input('email', sql.NVarChar, email || null)
      .input('attachmentPath', sql.NVarChar, attachmentPath || null)
      .input('problemStatement', sql.NVarChar, problemStatement)
      .input('currentMethod', sql.NVarChar, currentMethod || null)
      .input('proposedNewProcess', sql.NVarChar, proposedNewProcess || null)
      .input('expectedOutcome', sql.NVarChar, expectedOutcome || null)
      .input('benefits', sql.NVarChar, benefits || null)
      .input('consequences', sql.NVarChar, consequences || null)
      .input('functionHeadEmail', sql.NVarChar, functionHeadEmail || null)
      .query(`
        INSERT INTO changerequests (
          requestedBy,
          date,
          contactDetails,
          email,
          attachmentPath,
          problemStatement,
          currentMethod,
          proposedNewProcess,
          expectedOutcome,
          benefits,
          consequences,
          functionHeadEmail
        ) VALUES (
          @requestedBy,
          @date,
          @contactDetails,
          @email,
          @attachmentPath,
          @problemStatement,
          @currentMethod,
          @proposedNewProcess,
          @expectedOutcome,
          @benefits,
          @consequences,
          @functionHeadEmail
        )
      `);

    await pool.close();

    res.status(201).json({ message: 'Change request submitted successfully.' });
  } catch (error) {
    console.error('DB insert error:', error.stack || error);
    res.status(500).json({ error: 'Failed to submit change request.', details: error.message || error });
  }
});

// Optional: Health check GET endpoint
router.get('/', (req, res) => {
  res.send('✅ Change Requests endpoint is live and reachable via GET');
});

module.exports = router;
