const express = require('express');
const router = express.Router();
const sql = require('mssql');
const nodemailer = require('nodemailer');
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


// POST /api/report-problem
router.post('/', async (req, res) => {
  console.log('📥 Clarification POST route called');
  console.log('Request body:', req.body);

  const { problemID,problemDescription, domain, problemStatement, attachmentPath,email } = req.body;

  if (!problemDescription || !domain || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  
  try {
    const pool = await sql.connect(config);

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

    const { reportedBy,psNumber } = userResult.recordset[0];
    const clarificationID = 'CL' + Date.now();

    await pool.request()
      .input('clarificationID', sql.VarChar, clarificationID)
      .input('problemID', sql.VarChar, problemID)
      .input('problemDescription', sql.NVarChar, problemDescription)
      .input('domain', sql.NVarChar, domain)
      .input('problemStatement', sql.NVarChar, problemStatement)
      .input('attachmentPath', sql.NVarChar, attachmentPath)
      .input('reportedBy', sql.NVarChar, reportedBy)
      .input('psNumber', sql.NVarChar, psNumber)
      .input('email', sql.NVarChar, email)
      .query(`
        INSERT INTO clarification (clarificationID,problemID,ProblemDescription, Domain, ProblemStatement, AttachmentPath,reportedBy, psNumber, email) 
              VALUES (@clarificationID,@problemID,@problemDescription, @domain, @problemStatement, @attachmentPath,@reportedBy, @psNumber, @email)
        `
      );


    // Email acknowledgment
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'evakerenskyishere@gmail.com',         // replace with your Gmail
        pass: 'vaub huvm rggk scrt',      // use Gmail app password
      },
    });

    const mailOptions = {
      from: 'evakerenskyishere@gmail.com',
      to: email,
      subject: 'Clarification Confirmation',
      text: `Thank you for reporting a clarification to your problem. We will get back to you shortly with a resolution!`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: ' Clarification reported successfully', problemID });
  } catch (err) {
    console.error('❌ Error:', err);
    return res.status(500).json({ error: 'Something went wrong while reporting the problem.' });
  }
});

module.exports = router;
