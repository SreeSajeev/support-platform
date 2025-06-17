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

// Get or reuse DB pool
async function getPool() {
  try {
    if (pool) {
      await pool.request().query('SELECT 1');
      return pool;
    }
    pool = await sql.connect(config);
    console.log('✅ Connected to SQL (Clarification)');
    return pool;
  } catch (err) {
    console.error('❌ Failed to connect to SQL:', err.message);
    pool = null;
    throw err;
  }
}

// 🔍 GET user info (used to pre-fill form)
router.get('/user-info', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query(`
        SELECT name AS reportedBy, ps_number AS psNumber, email
        FROM Users
        WHERE email = @email
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Error fetching user info:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// 📝 POST clarification
router.post('/', async (req, res) => {
  console.log('📥 Clarification POST hit:', req.body);

  const {
    problemID,
    problemDescription,
    domain,
    problemStatement,
    attachmentPath,
    email
  } = req.body;

  if (!problemDescription || !domain || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const clarificationID = 'CL' + Date.now();

  try {
    const pool = await getPool();

    const userResult = await pool.request()
      .input('email', sql.NVarChar, email)
      .query(`
        SELECT name AS reportedBy, ps_number AS psNumber
        FROM Users
        WHERE email = @email
      `);

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { reportedBy, psNumber } = userResult.recordset[0];

    await pool.request()
      .input('clarificationID', sql.VarChar, clarificationID)
      .input('problemID', sql.VarChar, problemID)
      .input('problemDescription', sql.NVarChar, problemDescription)
      .input('domain', sql.NVarChar, domain)
      .input('problemStatement', sql.NVarChar, problemStatement || '')
      .input('attachmentPath', sql.NVarChar, attachmentPath || '')
      .input('reportedBy', sql.NVarChar, reportedBy)
      .input('psNumber', sql.NVarChar, psNumber)
      .input('email', sql.NVarChar, email)
      .query(`
        SET NOCOUNT ON;
        INSERT INTO clarification (
          clarificationID, problemID, ProblemDescription, Domain,
          ProblemStatement, AttachmentPath, reportedBy, psNumber, email
        )
        VALUES (
          @clarificationID, @problemID, @problemDescription, @domain,
          @problemStatement, @attachmentPath, @reportedBy, @psNumber, @email
        )
      `);

    // Send acknowledgment email
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
      subject: 'Clarification Submitted',
      text: `
Hi ${reportedBy},

Your clarification has been submitted successfully.

 Clarification ID: ${clarificationID}
 Related Problem ID: ${problemID}
 Description: ${problemDescription}
 Domain: ${domain}

Thank you,
IT Helpdesk Team
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Clarification submitted successfully', clarificationID });
  } catch (err) {
    console.error('❌ Clarification submission failed:', err);
    return res.status(500).json({ error: 'Failed to submit clarification' });
  }
});

module.exports = router;
