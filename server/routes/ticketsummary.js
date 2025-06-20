const express = require('express');
const router = express.Router();
const sql = require('mssql');

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
  try {
    if (pool) {
      await pool.request().query('SELECT 1');
      return pool;
    }
    pool = await sql.connect(config);
    console.log('Connected to SQL');
    return pool;
  } catch (err) {
    console.error('❌ SQL connection failed:', err.message);
    pool = null;
    throw err;
  }
}

router.post('/', async (req, res) => {
  const {
    ticketId,
    type,
    domain,
    searchTerm,
    requestedBy,
    reviewer,
    priority,
    trApplicable,
    trDetails,
    trReason,
    status,
    date,
    transaction,
    product,
    func,
    plant,
    mobile,
    external,
    developConfigure,
    unitTest,
    implementOAS,
    qualityTest,
    implementPRD,
    age
  } = req.body;

  if (!ticketId || !type || !domain || !searchTerm || !requestedBy || !reviewer) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await getPool();

    // Insert into ticketSummary
    await pool.request()
      .input('type', sql.NVarChar, type)
      .input('domain', sql.NVarChar, domain)
      .input('searchTerm', sql.NVarChar, searchTerm)
      .input('requestedBy', sql.NVarChar, requestedBy)
      .input('reviewer', sql.NVarChar, reviewer)
      .input('priority', sql.NVarChar, priority)
      .input('trApplicable', sql.NVarChar, trApplicable)
      .input('trDetails', sql.NVarChar(sql.MAX), trDetails)
      .input('trReason', sql.NVarChar(sql.MAX), trReason)
      .input('status', sql.NVarChar, status)
      .input('date', sql.NVarChar, date)
      .input('transactionName', sql.NVarChar, transaction)
      .input('product', sql.NVarChar, product)
      .input('functionName', sql.NVarChar, func)
      .input('plant', sql.NVarChar, plant)
      .input('mobileNumber', sql.NVarChar, mobile)
      .input('externalNumber', sql.NVarChar, external)
      .input('developConfigure', sql.Bit, developConfigure)
      .input('unitTest', sql.Bit, unitTest)
      .input('implementOAS', sql.Bit, implementOAS)
      .input('qualityTest', sql.Bit, qualityTest)
      .input('implementPRD', sql.Bit, implementPRD)
      .input('uniqueID', sql.NVarChar, ticketId)

      .query(`
        INSERT INTO ticketSummary (
  Type, Domain, SearchTerm, RequestedBy, Reviewer,
  TRApplicability, TRDetails, TRReason,
  Status, Date, 
  TransactionName, Product, FunctionName,
  Plant, MobileNumber, ExternalNumber,
  DevelopConfigure, UnitTest, ImplementInOAS,
  QualityTest, ImplementInPRD, CreatedAt, UniqueID
)
VALUES (
  @type, @domain, @searchTerm, @requestedBy, @reviewer,
  @trApplicable, @trDetails, @trReason,
  @status, @date, 
  @transactionName, @product, @functionName,
  @plant, @mobileNumber, @externalNumber,
  @developConfigure, @unitTest, @implementOAS,
  @qualityTest, @implementPRD, GETDATE(), @uniqueID
)

      `);

    // Update AllTickets with summary fields
    await pool.request()
      .input('uniqueID', sql.UniqueIdentifier, ticketId)
      .input('reviewer', sql.NVarChar, reviewer)
      .input('priority', sql.NVarChar, priority)
      .input('status', sql.NVarChar, status)
      .input('date', sql.NVarChar, date)
      .input('type', sql.NVarChar, type)
      .input('domain', sql.NVarChar, domain)
      .input('searchTerm', sql.NVarChar, searchTerm)
      .input('transactionName', sql.NVarChar, transaction)
      .input('product', sql.NVarChar, product)
      .input('functionName', sql.NVarChar, func)
      .input('plant', sql.NVarChar, plant)
      .input('mobileNumber', sql.NVarChar, mobile)
      .input('externalNumber', sql.NVarChar, external)
      .query(`
        UPDATE AllTickets
        SET
          AssignedTo = @reviewer,
          Priority = @priority,
          Status = @status,
          Date = @date,
          Type = @type,
          Domain = @domain,
          SearchTerm = @searchTerm,
          TransactionName = @transactionName,
          Product = @product,
          FunctionName = @functionName,
          Plant = @plant,
          MobileNumber = @mobileNumber,
          ExternalNumber = @externalNumber
        WHERE UniqueID = @uniqueID
      `);

    res.json({ message: 'Ticket Summary saved and AllTickets updated successfully' });
  } catch (err) {
    console.error('DB insert error:', err);
    res.status(500).json({ error: 'Failed to save ticket summary' });
  }
});

router.get('/', (req, res) => {
  res.send('Ticket Summary endpoint is live.');
});

module.exports = router;
