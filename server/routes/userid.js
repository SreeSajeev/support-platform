const express = require('express');
const sql = require('mssql');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Azure SQL config
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
  if (pool) {
    try {
      await pool.request().query('SELECT 1');
      return pool;
    } catch (err) {
      console.warn('⚠️ Reconnecting to SQL Server...');
      await pool.close().catch(() => {});
      pool = null;
    }
  }

  try {
    pool = await sql.connect(config);
    console.log('✅ Connected to Azure SQL');
    return pool;
  } catch (err) {
    console.error('❌ Connection failed:', err);
    throw err;
  }
}

const upload = multer({ dest: 'uploads/' });

router.get('/', (req, res) => {
  res.send('User ID API running...');
});

// ============ ORIGINAL ROUTE ============
// Save to DB + generate and return PDF
router.post('/', upload.single('attachment'), async (req, res) => {
  try {
    const {
      Username, Employee_ID, Designation, Email, Department, Mobile, Location,
      Reporting_to, Details, OtherApplication,
      Email_Teams, Internet_Access, OmniDocs,
      SAP_ID_Authorization, Stockit_Portal, OmniFlow,
      VPN_ID, Power_BI, KM_Portal
    } = req.body;

    const AttachmentFileNames = req.file ? req.file.originalname : '';

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
      .input('Email_Teams', sql.Bit, Email_Teams === 'true')
      .input('Internet_Access', sql.Bit, Internet_Access === 'true')
      .input('OmniDocs', sql.Bit, OmniDocs === 'true')
      .input('SAP_ID_Authorization', sql.Bit, SAP_ID_Authorization === 'true')
      .input('Stockit_Portal', sql.Bit, Stockit_Portal === 'true')
      .input('OmniFlow', sql.Bit, OmniFlow === 'true')
      .input('VPN_ID', sql.Bit, VPN_ID === 'true')
      .input('Power_BI', sql.Bit, Power_BI === 'true')
      .input('KM_Portal', sql.Bit, KM_Portal === 'true')
      .query(`
        INSERT INTO UserID (
          Username, Employee_ID, Designation, Email, Department, Mobile, Location, Reporting_to,
          Details, AttachmentFileNames, OtherApplication,
          Email_Teams, Internet_Access, OmniDocs,
          SAP_ID_Authorization, Stockit_Portal, OmniFlow,
          VPN_ID, Power_BI, KM_Portal
        ) VALUES (
          @Username, @Employee_ID, @Designation, @Email, @Department, @Mobile, @Location, @Reporting_to,
          @Details, @AttachmentFileNames, @OtherApplication,
          @Email_Teams, @Internet_Access, @OmniDocs,
          @SAP_ID_Authorization, @Stockit_Portal, @OmniFlow,
          @VPN_ID, @Power_BI, @KM_Portal
        )
      `);

    // Generate PDF
    const doc = new PDFDocument();
    const pdfPath = path.join(__dirname, `../../generated/UserID_${Employee_ID}.pdf`);
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.fontSize(20).text('User ID Request Form', { align: 'center' }).moveDown();
    const entries = {
      Username, Employee_ID, Designation, Email, Department, Mobile, Location,
      Reporting_to, Details, OtherApplication, AttachmentFileNames,
      Email_Teams, Internet_Access, OmniDocs, SAP_ID_Authorization, Stockit_Portal,
      OmniFlow, VPN_ID, Power_BI, KM_Portal
    };
    Object.entries(entries).forEach(([key, val]) => {
      doc.fontSize(12).text(`${key.replace(/_/g, ' ')}: ${val}`);
    });

    doc.end();
    writeStream.on('finish', () => {
      res.download(pdfPath, `UserID_${Employee_ID}.pdf`, (err) => {
        if (err) {
          console.error('Download error:', err);
          res.status(500).send('Failed to send PDF');
        }
        fs.unlink(pdfPath, () => {}); // cleanup
      });
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong during submission' });
  }
});

// ============ NEW ROUTE ============
// Generate and return PDF only (no DB insert)
router.post('/pdf', async (req, res) => {
  try {
    const {
      Username, Employee_ID, Designation, Email, Department, Mobile, Location,
      Reporting_to, Details, OtherApplication,
      Email_Teams, Internet_Access, OmniDocs,
      SAP_ID_Authorization, Stockit_Portal, OmniFlow,
      VPN_ID, Power_BI, KM_Portal
    } = req.body;

    const doc = new PDFDocument();
    const pdfPath = path.join(__dirname, `../../generated/UserID_${Employee_ID || 'form'}.pdf`);
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.fontSize(20).text('User ID Request Form (Preview)', { align: 'center' }).moveDown();
    const entries = {
      Username, Employee_ID, Designation, Email, Department, Mobile, Location,
      Reporting_to, Details, OtherApplication,
      Email_Teams, Internet_Access, OmniDocs, SAP_ID_Authorization, Stockit_Portal,
      OmniFlow, VPN_ID, Power_BI, KM_Portal
    };
    Object.entries(entries).forEach(([key, val]) => {
      doc.fontSize(12).text(`${key.replace(/_/g, ' ')}: ${val}`);
    });

    doc.end();
    writeStream.on('finish', () => {
      res.download(pdfPath, `UserID_${Employee_ID || 'form'}.pdf`, (err) => {
        if (err) {
          console.error('Download error:', err);
          res.status(500).send('Failed to send PDF');
        }
        fs.unlink(pdfPath, () => {}); // cleanup
      });
    });
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

module.exports = router;
