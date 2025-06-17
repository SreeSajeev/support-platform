const express = require('express');
const sql = require('mssql');
const router = express.Router();

const config = {
  user: 'helpdesk_admin',
  password: 'Helpdesk123!',
  server: 'localhost',
  port: 1433,
  database: 'test', // or whatever you named it
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

async function getPool() {
  try {
    if (pool) {
      // Check if connection is still active
      await pool.request().query('SELECT 1');
      return pool;
    }
    pool = await sql.connect(config);
    console.log('Connected to SQL');
    return pool;
  } catch (err) {
    console.error('❌ SQL connection failed:', err.message);
    pool = null; // Reset if it's broken
    throw err;
  }
}

// Test route
router.get('/', (req, res) => {
  res.send('📊 IT ticket details API is running!');
});

router.post('/', async (req, res) => {
  const {
    
    ProblemStatement,
    RootCauseObjective,
    ReviewRemarks,
    PreviousReview = '',
    AdditionalNotes = '',
    TimeSpent,
    AttachmentFileName = '',
    AttachmentFilePath = '',
    CreatedAt,
  } = req.body;

  if (!ProblemStatement || !RootCauseObjective || !ReviewRemarks || TimeSpent === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const parsedTime = parseFloat(TimeSpent);
  if (isNaN(parsedTime)) {
    return res.status(400).json({ error: 'TimeSpent must be a valid number' });
  }

  try {
    const pool = await getPool();
    await pool.request()
      
      .input('ProblemStatement', sql.NVarChar, ProblemStatement)
      .input('RootCauseObjective', sql.NVarChar, RootCauseObjective)
      .input('ReviewRemarks', sql.NVarChar, ReviewRemarks)
      .input('PreviousReview', sql.NVarChar, PreviousReview)
      .input('AdditionalNotes', sql.NVarChar, AdditionalNotes)
      .input('TimeSpent', sql.Float, parsedTime)
      .input('AttachmentFileName', sql.NVarChar(sql.MAX), AttachmentFileName)
      .input('AttachmentFilePath', sql.NVarChar(sql.MAX), AttachmentFilePath)
      .input('CreatedAt', sql.DateTime2, new Date(CreatedAt))
      .query(`
        INSERT INTO ticket_details (
           ProblemStatement, RootCauseObjective, ReviewRemarks,
          PreviousReview, AdditionalNotes, TimeSpent,
          AttachmentFileName, AttachmentFilePath, CreatedAt
        )
        VALUES (
           @ProblemStatement, @RootCauseObjective, @ReviewRemarks,
          @PreviousReview, @AdditionalNotes, @TimeSpent,
          @AttachmentFileName, @AttachmentFilePath, @CreatedAt
        )
      `);

    res.json({ message: 'Ticket details saved successfully' });
  } catch (err) {
    console.error('Insert Error:', err.message);
    res.status(500).json({ error: 'Database insertion failed' });
  }
});

module.exports = router;
