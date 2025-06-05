const express = require('express');
const router = express.Router();
const sql = require('mssql');

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


router.post('/', async (req, res) => {
  const {
    type,
    domain,
    searchTerm,
    requestedBy,
    reviewer,
    trApplicable,
    trDetails,
    trReason,

    // Additional fields from frontend
    status,
    date,
    transaction,
    product,
    func,
    plant,
    mobile,
    external
  } = req.body;

  // Basic validation
  if (!type || !domain || !searchTerm || !requestedBy || !reviewer) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await sql.connect(config);

    await pool.request()
      .input('type', sql.NVarChar, type)
      .input('domain', sql.NVarChar, domain)
      .input('searchTerm', sql.NVarChar, searchTerm)
      .input('requestedBy', sql.NVarChar, requestedBy)
      .input('reviewer', sql.NVarChar, reviewer)
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
      .query(`
        INSERT INTO ticketSummary (
          Type, Domain, SearchTerm, RequestedBy, Reviewer,
          TRApplicability, TRDetails, TRReason,
          Status, Date, 
          TransactionName, Product, FunctionName,
          Plant, MobileNumber, ExternalNumber
        )
        VALUES (
          @type, @domain, @searchTerm, @requestedBy, @reviewer,
          @trApplicable, @trDetails, @trReason,
          @status, @date, 
          @transactionName, @product, @functionName,
          @plant, @mobileNumber, @externalNumber
        )
      `);

    await pool.close();
    res.json({ message: 'Ticket Summary saved successfully' });
  } catch (err) {
    console.error('DB insert error:', err);
    res.status(500).json({ error: 'Failed to save ticket summary' });
  }
});


router.get('/', (req, res) => {
  res.send('Ticket Summary endpoint is live.');
});

module.exports = router;
