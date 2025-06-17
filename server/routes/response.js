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
*/}// ✅ FINAL response.js: Uses UniqueID, fetches ticket from AllTickets, and inserts into responseThread
const express = require('express');
const sql = require('mssql');
const nodemailer = require('nodemailer');
const router = express.Router();

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
async function getPool() {
  if (pool) return pool;
  try {
    pool = await sql.connect(config);
    console.log('Connected to SQL (IT Helpdesk View)');
    return pool;
  } catch (err) {
    console.error('❌ Failed to connect to DB:', err);
    throw err;
  }
}

// Test route
router.get('/', (req, res) => {
  res.send(' IT ticket responses API is running!');
});

// POST /api/ticket-responses
router.post('/', async (req, res) => {
  const {
    UniqueID,
    Status,
    Owner,
    StartDateTime,
    TargetDateTime,
    CCAddress,
    Message,
    AttachmentFileNames,
    CreatedAt
  } = req.body;

  if (!Message || !Status || !Owner || !StartDateTime || !TargetDateTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await getPool();
    const request = pool.request()
      .input('Status', sql.NVarChar, Status)
      .input('Owner', sql.NVarChar, Owner)
      .input('StartDateTime', sql.DateTime2, new Date(StartDateTime))
      .input('TargetDateTime', sql.DateTime2, new Date(TargetDateTime))
      .input('CCAddress', sql.NVarChar, CCAddress || null)
      .input('Message', sql.NVarChar(sql.MAX), Message)
      .input('AttachmentFileNames', sql.NVarChar(sql.MAX), AttachmentFileNames || '')
      .input('CreatedAt', sql.DateTime2, new Date(CreatedAt));

    if (UniqueID) {
      request.input('UniqueID', sql.UniqueIdentifier, UniqueID);
    }

    const query = `
      INSERT INTO responseThread (
        ${UniqueID ? 'UniqueID, ' : ''}Status, Owner, StartDateTime, TargetDateTime,
        CCAddress, Message, AttachmentFileNames, CreatedAt
      )
      VALUES (
        ${UniqueID ? '@UniqueID, ' : ''}@Status, @Owner, @StartDateTime, @TargetDateTime,
        @CCAddress, @Message, @AttachmentFileNames, @CreatedAt
      )
    `;

    await request.query(query);

    if (CCAddress) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'evakerenskyishere@gmail.com',
          pass: 'vaub huvm rggk scrt'
        }
      });

      await transporter.sendMail({
        from: 'evakerenskyishere@gmail.com',
        to: CCAddress,
        subject: `IT Support Ticket Response`,
        text: `Message from IT:

${Message}`
      });
    }

    res.json({ message: 'Response submitted successfully' });
  } catch (err) {
    console.error('Insert Error:', err.message);
    res.status(500).json({ error: 'Database insertion or email failed' });
  }
});

module.exports = router;
