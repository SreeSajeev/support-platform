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
