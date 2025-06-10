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
  res.send('📊 IT ticket details API is running!');
});

router.post('/', async (req, res) => {
  const {
    TicketID,
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
      .input('TicketID', sql.NVarChar, TicketID || '')
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
          TicketID, ProblemStatement, RootCauseObjective, ReviewRemarks,
          PreviousReview, AdditionalNotes, TimeSpent,
          AttachmentFileName, AttachmentFilePath, CreatedAt
        )
        VALUES (
          @TicketID, @ProblemStatement, @RootCauseObjective, @ReviewRemarks,
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
