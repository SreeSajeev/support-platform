const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Azure SQL config
const config = {
  user: 'adminuser',
  password: 'BUR123ger@',
  server: 'supportserver123.database.windows.net',
  database: 'supportDB',
  options: { encrypt: true, trustServerCertificate: false },
};

let pool;
async function getPool() {
  if (pool) return pool;
  pool = await sql.connect(config);
  console.log('✅ Connected to Azure SQL (Search)');
  return pool;
}

router.post('/', async (req, res) => {
  const {
    Domain,
    Type,
    RaisedBy,
    Status,
    Date,
    AssignedTo,
    Priority,
    ResolutionDate
  } = req.body;

  try {
    const pool = await getPool();
    const request = pool.request();
    const whereClauses = [];

    if (Domain) {
      whereClauses.push('Domain LIKE @Domain');
      request.input('Domain', sql.NVarChar, `%${Domain}%`);
    }
    if (Type) {
      whereClauses.push('[Type] LIKE @Type');
      request.input('Type', sql.NVarChar, `%${Type}%`);
    }
    if (RaisedBy) {
      whereClauses.push('RaisedBy LIKE @RaisedBy');
      request.input('RaisedBy', sql.NVarChar, `%${RaisedBy}%`);
    }
    if (Status) {
      whereClauses.push('Status LIKE @Status');
      request.input('Status', sql.NVarChar, `%${Status}%`);
    }
    if (Date) {
      whereClauses.push('[Date] = @Date');
      request.input('Date', sql.Date, Date);
    }
    if (AssignedTo) {
      whereClauses.push('AssignedTo LIKE @AssignedTo');
      request.input('AssignedTo', sql.NVarChar, `%${AssignedTo}%`);
    }
    if (Priority) {
      whereClauses.push('Priority LIKE @Priority');
      request.input('Priority', sql.NVarChar, `%${Priority}%`);
    }
    if (ResolutionDate) {
      whereClauses.push('ResolutionDate = @ResolutionDate');
      request.input('ResolutionDate', sql.Date, ResolutionDate);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const query = `SELECT * FROM alltickets_table ${whereSQL} ORDER BY [Date] DESC`;

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Search failed:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
