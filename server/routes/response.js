{/*}
const express = require('express');
const sql = require('mssql');
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
  try {
    pool = await sql.connect(config);
    console.log('Connected to Azure SQL');
    return pool;
  } catch (err) {
    console.error('DB Connection Error:', err);
    throw err;
  }
}
// Test route
router.get('/', (req, res) => {
  res.send('📊 IT ticket responses API is running!');
});


router.post('/', async (req, res) => {
  const {
        ResponseID,
        IssueNumber,
        Status,
        Owner,
        StartDateTime,
        TargetDateTime,
        CCAddress,
        Message,
        AttachmentFileNames ,
        CreatedAt
  } = req.body;

  if (!IssueNumber || !Status || !Owner || StartDateTime === undefined ||TargetDateTime === undefined ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const parsedTime = parseFloat(StartDateTime);
  if (isNaN(parsedTime)) {
    return res.status(400).json({ error: 'StartDateTime must be a valid number' });
  }

  try {
    const pool = await getPool();
    await pool.request()

      .input('IssueNumber', sql.NVarChar, IssueNumber)
      .input('Status', sql.NVarChar, Status)
      .input('Owner', sql.NVarChar, Owner)
      .input('StartDateTime', sql.Float, parsedTime)
      .input('TargetDateTime', sql.Float, parsedTime)
      .input('AttachmentFileNames', sql.NVarChar(sql.MAX), AttachmentFileNames || '')

      .input('CCAddress', sql.NVarChar, CCAddress)
      .input('Message', sql.NVarChar, Message)  
      .input('CreatedAt', sql.DateTime2, new Date(CreatedAt))
      .query(`
        
        INSERT INTO ticketresponses (
           IssueNumber, Status, Owner, StartDateTime, TargetDateTime, CCAddress, Message,
          AttachmentFileNames, CreatedAt
        )
        VALUES (
           @IssueNumber, @Status, @Owner, @StartDateTime, @TargetDateTime, @CCAddress, @Message,
          @AttachmentFileNames, @CreatedAt
        )
      `);

    res.json({ message: 'Ticket Response saved successfully' });
  } catch (err) {
    console.error('Insert Error:', err.message);
    res.status(500).json({ error: 'Database insertion failed' });
  }
});

module.exports = router;
*/}
// ✅ UPDATED response.js with email + GET thread
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
  try {
    pool = await sql.connect(config);
    console.log('Connected to Azure SQL');
    return pool;
  } catch (err) {
    console.error('DB Connection Error:', err);
    throw err;
  }
}

// Test route
router.get('/', (req, res) => {
  res.send('📊 IT ticket responses API is running!');
});

// 📨 GET response thread for a ticket
router.get('/:issueNumber', async (req, res) => {
  const { issueNumber } = req.params;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('IssueNumber', sql.NVarChar, issueNumber)
      .query(`
        SELECT CreatedAt, Owner, Message
        FROM ticketresponses
        WHERE IssueNumber = @IssueNumber
        ORDER BY CreatedAt ASC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Thread Fetch Error:', err);
    res.status(500).json({ error: 'Failed to fetch response thread' });
  }
});

// 📝 POST new response
router.post('/', async (req, res) => {
  const {
    IssueNumber,
    Status,
    Owner,
    StartDateTime,
    TargetDateTime,
    CCAddress,
    Message,
    AttachmentFileNames,
    CreatedAt
  } = req.body;

  if (!IssueNumber || !Status || !Owner || !StartDateTime || !TargetDateTime || !Message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await getPool();
    await pool.request()
      .input('IssueNumber', sql.NVarChar, IssueNumber)
      .input('Status', sql.NVarChar, Status)
      .input('Owner', sql.NVarChar, Owner)
      .input('StartDateTime', sql.DateTime2, new Date(StartDateTime))
      .input('TargetDateTime', sql.DateTime2, new Date(TargetDateTime))
      .input('CCAddress', sql.NVarChar, CCAddress)
      .input('Message', sql.NVarChar(sql.MAX), Message)
      .input('AttachmentFileNames', sql.NVarChar(sql.MAX), AttachmentFileNames || '')
      .input('CreatedAt', sql.DateTime2, new Date(CreatedAt))
      .query(`
        INSERT INTO ticketresponses (
          IssueNumber, Status, Owner, StartDateTime, TargetDateTime,
          CCAddress, Message, AttachmentFileNames, CreatedAt
        ) VALUES (
          @IssueNumber, @Status, @Owner, @StartDateTime, @TargetDateTime,
          @CCAddress, @Message, @AttachmentFileNames, @CreatedAt
        )
      `);

    // 📧 Send email to CC
    if (CCAddress) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'evakerenskyishere@gmail.com',
          pass: 'vaub huvm rggk scrt'
        }
      });

      const mailOptions = {
        from: 'evakerenskyishere@gmail.com',
        to: CCAddress,
        subject: `Response for Ticket ${IssueNumber}`,
        text: `Hello,\n\nThis is an update for ticket ${IssueNumber}:\n\n${Message}\n\nRegards,\nIT Support`
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ message: 'Ticket Response saved and email sent successfully' });
  } catch (err) {
    console.error('Insert Error:', err.message);
    res.status(500).json({ error: 'Database insertion or email failed' });
  }
});

module.exports = router;
