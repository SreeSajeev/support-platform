
const express = require('express');
const sql = require('mssql');
const nodemailer = require('nodemailer');

const router = express.Router();

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

// 🔍 GET user info by email (used by frontend to prefill form)
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
      SELECT name AS reportedBy, psNumber 
      FROM Users 
      WHERE email = @email
    `);



    if (userResult.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found in Users table.' });
    }

    const { reportedBy, psNumber } = userResult.recordset[0];

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
        INSERT INTO OldProblems (
          problemID, description, domain, inputDetails, systemMessage, reportedBy, psNumber, email
        )
        VALUES (
          @problemID, @description, @domain, @inputDetails, @systemMessage, @reportedBy, @psNumber, @email
        )
      `);

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
      text: `Thank you for reporting a problem. Your Problem ID is ${problemID}. We will get back to you shortly with a resolution!`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Problem reported successfully', problemID });
  } catch (err) {
    console.error('❌ Error:', err);
    return res.status(500).json({ error: 'Something went wrong while reporting the problem.' });
  }
});

module.exports = router;
