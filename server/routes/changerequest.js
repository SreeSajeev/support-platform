const express = require('express');
const router = express.Router();
const sql = require('mssql');
const nodemailer = require('nodemailer');

// SQL Server config
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

// Create or reuse connection pool
async function getPool() {
  try {
    if (pool) {
      await pool.request().query('SELECT 1');
      return pool;
    }
    pool = await sql.connect(config);
    console.log('✅ Connected to SQL Server');
    return pool;
  } catch (err) {
    console.error('❌ SQL connection failed:', err.message);
    pool = null;
    throw err;
  }
}

// Get user info
router.get('/user-info', async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ error: 'Email query param is required' });

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query(`SELECT name AS reportedBy, email FROM Users WHERE email = @email`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Error fetching user info:', err);
    return res.status(500).json({ error: 'Server error fetching user info' });
  }
});

// Submit a change request
router.post('/', async (req, res) => {
  const {
    requestedBy,
    email,
    date,
    contactDetails,
    attachmentPath,
    problemStatement,
    currentMethod,
    proposedNewProcess,
    expectedOutcome,
    benefits,
    consequences,
    functionHeadEmail,
  } = req.body;

  if (!email || !date || !problemStatement) {
    return res.status(400).json({ error: 'Email, date, and problem statement are required.' });
  }

  try {
    const pool = await getPool();

    // Get reportedBy name
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query(`SELECT name FROM Users WHERE email = @email`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found in Users table.' });
    }

    const { name: reportedBy } = result.recordset[0];

    // INSERT without OUTPUT clause
    await pool.request()
      .input('RequestDate', sql.Date, date)
      .input('RequestedBy', sql.NVarChar, reportedBy)
      .input('Email', sql.NVarChar, email)
      .input('ContactDetails', sql.NVarChar, contactDetails || null)
      .input('AttachmentPath', sql.NVarChar, attachmentPath || null)
      .input('ProblemStatement', sql.NVarChar, problemStatement)
      .input('CurrentMethod', sql.NVarChar, currentMethod || null)
      .input('ProposedProcess', sql.NVarChar, proposedNewProcess || null)
      .input('ExpectedOutcome', sql.NVarChar, expectedOutcome || null)
      .input('Benefits', sql.NVarChar, benefits || null)
      .input('ConsequencesIfNotChanged', sql.NVarChar, consequences || null)
      .input('FunctionHeadEmail', sql.NVarChar, functionHeadEmail || null)
      .query(`
        SET NOCOUNT ON;
        INSERT INTO changeRequests (
          RequestDate, RequestedBy, Email, ContactDetails, AttachmentPath,
          ProblemStatement, CurrentMethod, ProposedProcess, ExpectedOutcome,
          Benefits, ConsequencesIfNotChanged, FunctionHeadEmail
        ) VALUES (
          @RequestDate, @RequestedBy, @Email, @ContactDetails, @AttachmentPath,
          @ProblemStatement, @CurrentMethod, @ProposedProcess, @ExpectedOutcome,
          @Benefits, @ConsequencesIfNotChanged, @FunctionHeadEmail
        )
      `);

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'evakerenskyishere@gmail.com',
        pass: 'vaub huvm rggk scrt', // Consider storing in env vars
      },
    });

    const mailOptions = {
      from: 'evakerenskyishere@gmail.com',
      to: `${email}, ${functionHeadEmail}`,
      subject: 'New Change Request Submitted',
      text: `
Dear ${reportedBy},

A new Change Request has been submitted by ${reportedBy}. Below are the details:

Date: ${date}
Email: ${email}
Contact: ${contactDetails || 'N/A'}

Problem Statement:
${problemStatement}

Current Method:
${currentMethod || 'N/A'}

Proposed Process:
${proposedNewProcess || 'N/A'}

Expected Outcome:
${expectedOutcome || 'N/A'}

Benefits:
${benefits || 'N/A'}

Consequences if Not Changed:
${consequences || 'N/A'}

Attachment Path: ${attachmentPath || 'None'}

Please take appropriate action.

- IT Helpdesk Platform
`
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Submitted successfully' });
  } catch (err) {
    console.error('❌ Error:', err);
    return res.status(500).json({ error: 'Something went wrong while submitting the request.' });
  }
});

module.exports = router;
