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

router.post('/', async (req, res) => {
  const {
    ticketId,
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

  if (!ticketId || !ProblemStatement || !RootCauseObjective || !ReviewRemarks || TimeSpent === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const parsedTime = parseFloat(TimeSpent);
  if (isNaN(parsedTime)) {
    return res.status(400).json({ error: 'TimeSpent must be a valid number' });
  }

  try {
    const pool = await getPool();

    
    await pool.request()
      .input('UniqueID', sql.NVarChar, ticketId)
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
          UniqueID, ProblemStatement, RootCauseObjective, ReviewRemarks,
          PreviousReview, AdditionalNotes, TimeSpent,
          AttachmentFileName, AttachmentFilePath, CreatedAt
        )
        VALUES (
          @UniqueID, @ProblemStatement, @RootCauseObjective, @ReviewRemarks,
          @PreviousReview, @AdditionalNotes, @TimeSpent,
          @AttachmentFileName, @AttachmentFilePath, @CreatedAt
        )
      `);

    // ✅ 2. Update AllTickets with the same details
    await pool.request()
      .input('UniqueID', sql.NVarChar, ticketId)
      .input('ProblemStatement', sql.NVarChar, ProblemStatement)
      .input('RootCauseObjective', sql.NVarChar, RootCauseObjective)
      .input('ReviewRemarks', sql.NVarChar, ReviewRemarks)
      .input('PreviousReview', sql.NVarChar, PreviousReview)
      .input('AdditionalNotes', sql.NVarChar, AdditionalNotes)
      .input('TimeSpent', sql.Float, parsedTime)
      .input('AttachmentFileName', sql.NVarChar(sql.MAX), AttachmentFileName)
      .input('AttachmentFilePath', sql.NVarChar(sql.MAX), AttachmentFilePath)
      .input('Status', sql.NVarChar, 'Closed') // or whatever status logic
      .query(`
        UPDATE AllTickets
        SET
          ProblemStatement = @ProblemStatement,
          RootCauseObjective = @RootCauseObjective,
          ReviewRemarks = @ReviewRemarks,
          PreviousReview = @PreviousReview,
          AdditionalNotes = @AdditionalNotes,
          TimeSpent = @TimeSpent,
          AttachmentFileName = @AttachmentFileName,
          AttachmentFilePath = @AttachmentFilePath,
          Status = @Status
        WHERE UniqueID = @UniqueID
      `);

    res.json({ message: 'Ticket details saved and AllTickets updated.' });
  } catch (err) {
    console.error('❌ Insert Error:', err.message);
    res.status(500).json({ error: 'Database insertion failed' });
  }
});

module.exports = router;
