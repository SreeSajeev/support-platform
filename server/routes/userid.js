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

router.get('/', (req, res) => {
  res.send('UserID API is running!');
});

router.post('/', async (req, res) => {
  const {
    Username, Employee_ID, Designation, Email,
    Department, Mobile, Location, Reporting_to,
    Details, AttachmentFileNames, OtherApplication,

    // Access Types
    Email_Teams, Internet_Access, OmniDocs,
    SAP_ID_Authorization, Stockit_Portal, OmniFlow,
    VPN_ID, Power_BI, KM_Portal
  } = req.body;

  if (!Username || !Employee_ID || !Designation || !Email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await getPool();
    await pool.request()
      .input('Username', sql.NVarChar, Username)
      .input('Employee_ID', sql.NVarChar, Employee_ID)
      .input('Designation', sql.NVarChar, Designation)
      .input('Email', sql.NVarChar, Email)
      .input('Department', sql.NVarChar, Department)
      .input('Mobile', sql.NVarChar, Mobile)
      .input('Location', sql.NVarChar, Location)
      .input('Reporting_to', sql.NVarChar, Reporting_to)
      .input('Details', sql.NVarChar, Details)
      .input('AttachmentFileNames', sql.NVarChar(sql.MAX), AttachmentFileNames || '')
      .input('OtherApplication', sql.NVarChar, OtherApplication || '')

      // Access type bits
      .input('Email_Teams', sql.Bit, Email_Teams || 0)
      .input('Internet_Access', sql.Bit, Internet_Access || 0)
      .input('OmniDocs', sql.Bit, OmniDocs || 0)
      .input('SAP_ID_Authorization', sql.Bit, SAP_ID_Authorization || 0)
      .input('Stockit_Portal', sql.Bit, Stockit_Portal || 0)
      .input('OmniFlow', sql.Bit, OmniFlow || 0)
      .input('VPN_ID', sql.Bit, VPN_ID || 0)
      .input('Power_BI', sql.Bit, Power_BI || 0)
      .input('KM_Portal', sql.Bit, KM_Portal || 0)

      .query(`
        INSERT INTO UserID (
          Username, Employee_ID, Designation, Email, Department, Mobile, Location, Reporting_to,
          Details, AttachmentFileNames, OtherApplication,
          Email_Teams, Internet_Access, OmniDocs,
          SAP_ID_Authorization, Stockit_Portal, OmniFlow,
          VPN_ID, Power_BI, KM_Portal
        )
        VALUES (
          @Username, @Employee_ID, @Designation, @Email, @Department, @Mobile, @Location, @Reporting_to,
          @Details, @AttachmentFileNames, @OtherApplication,
          @Email_Teams, @Internet_Access, @OmniDocs,
          @SAP_ID_Authorization, @Stockit_Portal, @OmniFlow,
          @VPN_ID, @Power_BI, @KM_Portal
        )
      `);

    res.json({ message: 'UserID Form saved successfully ' });
  } catch (err) {
    console.error('Insert Error:', err.message);
    res.status(500).json({ error: 'Database insertion failed ' });
  }
});

module.exports = router;
