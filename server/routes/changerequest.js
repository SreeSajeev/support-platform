const express = require('express');
const router = express.Router();
const sql = require('mssql');

// SQL Server config
const config = {
  user: 'adminuser',
  password: 'BUR123ger@',
  server: 'supportserver123.database.windows.net',
  database: 'supportDB',
  options: {
    encrypt: true,
    trustServerCertificate: false, // Set to true only for local testing with self-signed certs
  },
};

router.post('/', async (req, res) => {
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

  // Log input for debugging
  console.log('🔔 /api/change-requests POST endpoint hit!');
  console.log('📦 Received body:', req.body);
  
  
  // Basic field validation
  if (!requestedBy || !date || !problemStatement) {
    return res.status(400).json({ error: 'Please provide requestedBy, date, and problemStatement.' });
  }

  try {
    // Connect to MSSQL
    const pool = await sql.connect(config);

      await pool.request()
    .input('requestedBy', sql.NVarChar, requestedBy)
    .input('requestDate', sql.Date, date)  // RequestDate not "date"
    .input('contactDetails', sql.NVarChar, contactDetails || null)
    .input('email', sql.NVarChar, email || null)
    .input('attachmentPath', sql.NVarChar, attachmentPath || null)
    .input('problemStatement', sql.NVarChar, problemStatement)
    .input('currentMethod', sql.NVarChar, currentMethod || null)
    .input('proposedProcess', sql.NVarChar, proposedNewProcess || null) // ProposedProcess, not proposedNewProcess
    .input('expectedOutcome', sql.NVarChar, expectedOutcome || null)
    .input('benefits', sql.NVarChar, benefits || null)
    .input('consequencesIfNotChanged', sql.NVarChar, consequences || null) // ConsequencesIfNotChanged, not consequences
    .input('functionHeadEmail', sql.NVarChar, functionHeadEmail || null)
    .query(`
      INSERT INTO changerequests (
        RequestedBy,
        RequestDate,
        ContactDetails,
        Email,
        AttachmentPath,
        ProblemStatement,
        CurrentMethod,
        ProposedProcess,
        ExpectedOutcome,
        Benefits,
        ConsequencesIfNotChanged,
        FunctionHeadEmail
      ) VALUES (
        @requestedBy,
        @requestDate,
        @contactDetails,
        @email,
        @attachmentPath,
        @problemStatement,
        @currentMethod,
        @proposedProcess,
        @expectedOutcome,
        @benefits,
        @consequencesIfNotChanged,
        @functionHeadEmail
      )
    `);


    console.log('✅ Insert result:', result);
    res.status(201).json({ message: 'Change request submitted successfully.' });
    console.log('✅ Rows affected:', result.rowsAffected); // should be [1]
    console.log('✅ Insert successful');

  } catch (error) {
    console.error('DB insert error:', error.stack || error);
    res.status(500).json({ error: 'Failed to submit change request.', details: error.message || error });
  
  } finally {
    await sql.close(); // Always close after use
  }
});

module.exports = router;
