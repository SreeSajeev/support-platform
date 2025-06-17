const express = require('express');
const sql = require('mssql');
const nodemailer = require('nodemailer');

const router = express.Router();

// SQL Server configuration
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

// Reuse or initialize SQL pool
async function getPool() {
  try {
    if (pool) {
      await pool.request().query('SELECT 1'); // keep-alive check
      return pool;
    }
    pool = await sql.connect(config);
    console.log('✅ Connected to SQL (OldProblems)');
    return pool;
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    pool = null;
    throw err;
  }
}

// 🔍 GET user info by email (for frontend prefill)
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
    return res.status(500).json({ error: 'Server error fetching user info' });
  }
});

// 📝 POST new problem report
router.post('/', async (req, res) => {
  const { description, domain, inputDetails, systemMessage, email } = req.body;

  if (!description || !domain || !email) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const problemID = `RP${Math.floor(100000 + Math.random() * 900000)}`;

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
      return res.status(404).json({ error: 'User not found in Users table.' });
    }

    const { reportedBy, psNumber } = userResult.recordset[0];

    // Insert into OldProblems (NO OUTPUT clause — trigger-safe)
    await pool.request()
      .input('problemID', sql.VarChar, problemID)
      .input('description', sql.NVarChar, description)
      .input('domain', sql.NVarChar, domain)
      .input('inputDetails', sql.NVarChar, inputDetails || '')
      .input('systemMessage', sql.NVarChar, systemMessage || '')
      .input('reportedBy', sql.NVarChar, reportedBy)
      .input('psNumber', sql.NVarChar, psNumber)
      .input('email', sql.NVarChar, email)
      .query(`
        SET NOCOUNT ON;
        INSERT INTO OldProblems (
          problemID, description, domain, inputDetails, systemMessage,
          reportedBy, psNumber, email
        )
        VALUES (
          @problemID, @description, @domain, @inputDetails, @systemMessage,
          @reportedBy, @psNumber, @email
        )
      `);

    // Email confirmation
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
      subject: 'Problem Report Confirmation',
      text: `
Dear ${reportedBy},

Thank you for reporting a problem through the IT Helpdesk Platform.

 Problem ID: ${problemID}
 Description: ${description}
 Domain: ${domain}
 Input Details: ${inputDetails || 'N/A'}
 System Message: ${systemMessage || 'N/A'}

We will get back to you shortly with a resolution.

- IT Helpdesk Team
`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Problem reported successfully', problemID });
  } catch (err) {
    console.error('❌ Error:', err);
    return res.status(500).json({ error: 'Something went wrong while reporting the problem.' });
  }
});

module.exports = router;
