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

  if (!problemDescription || !domain||!reportedBy || !psNumber || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  
  // Generate unique Problem ID
  const clarificationID = `RP${Math.floor(100000 + Math.random() * 900000)}`;
  try {
    const pool = await sql.connect(config);

    await pool.request()
      .input('problemDescription', sql.NVarChar, problemDescription)
      .input('domain', sql.NVarChar, domain)
      .input('problemStatement', sql.NVarChar, problemStatement)
      .input('attachmentPath', sql.NVarChar, attachmentPath)
      .input('reportedBy', sql.NVarChar, reportedBy)
      .input('psNumber', sql.NVarChar, psNumber)
      .input('email', sql.NVarChar, email)
      .query(`INSERT INTO clarification (clarificationID,ProblemDescription, Domain, ProblemStatement, AttachmentPath,reportedBy, psNumber, email) 
              VALUES (@clarificationID,@problemDescription, @domain, @problemStatement, @attachmentPath,@reportedBy, @psNumber, @email)`);


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
      text: `Thank you for reporting a clarification to your problem. Your ClarificationID is  ${problemID}. We will get back to you shortly with a resolution!`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Problem reported successfully', problemID });
  } catch (err) {
    console.error('❌ Error:', err);
    return res.status(500).json({ error: 'Something went wrong while reporting the problem.' });
  }
});

module.exports = router;
