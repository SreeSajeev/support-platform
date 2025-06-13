const express = require('express');
const router = express.Router();
const sql = require('mssql');
const nodemailer = require('nodemailer');

// SQL Server config
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

let pool;
async function getPool() {
  if (pool) return pool;
  pool = await sql.connect(config);
  console.log('✅ Connected to Azure SQL');
  return pool;
}

// Get user info based on email
router.get('/user-info', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email query param is required' });
  }

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query(`
        SELECT name AS reportedBy, email
        FROM Users
        WHERE email = @email
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Error fetching user info:', err);
    return res.status(500).json({ error: 'Server error fetching user info' });
  }
});

// POST change request
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

  // Input validation
  if (!email || !date || !problemStatement) {
    return res.status(400).json({ error: 'Email, date, and problem statement are required.' });
  }

  const problemID = `RP${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    const pool = await getPool();

    // Get name from Users table
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query(`SELECT name FROM Users WHERE email = @email`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found in Users table.' });
    }

    const { name: reportedBy } = result.recordset[0];

    // Insert into changeRequests table
    await pool.request()
     
      .input('RequestDate', sql.Date, date)
      .input('RequestedBy', sql.NVarChar, requestedBy)
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
        INSERT INTO changeRequests (
          
          RequestDate,
          RequestedBy,
          Email,
          ContactDetails,
          AttachmentPath,
          ProblemStatement,
          CurrentMethod,
          ProposedProcess,
          ExpectedOutcome,
          Benefits,
          ConsequencesIfNotChanged,
          FunctionHeadEmail
        ) VALUES (
          
          @RequestDate,
          @RequestedBy,
          @Email,
          @ContactDetails,
          @AttachmentPath,
          @ProblemStatement,
          @CurrentMethod,
          @ProposedProcess,
          @ExpectedOutcome,
          @Benefits,
          @ConsequencesIfNotChanged,
          @FunctionHeadEmail
        )
      `);

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'evakerenskyishere@gmail.com',
        pass: 'vaub huvm rggk scrt',
      },
    });

    const mailOptions = {
      from: 'evakerenskyishere@gmail.com',
      to: email,
      subject: 'Change Requests Confirmation',
      text: `Dear ${requestedBy},\n\nThank you for submitting your Change Requests request. We will get back to you shortly with a resolution!\n\n- Support Team`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Submitted successfully' });
  } catch (err) {
    console.error('❌ Error:', err);
    return res.status(500).json({ error: 'Something went wrong while submitting the request.' });
  }
});

module.exports = router;
