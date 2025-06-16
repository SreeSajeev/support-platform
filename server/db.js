// db.js
const sql = require('mssql');

const config = {
  user: 'adminuser',
  password: 'BUR123ger@',
  database: 'supportDB',
  server: 'supportserver123.database.windows.net',
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

let pool;

async function getPool() {
  if (pool) {
    try {
      // Check if connection is alive
      await pool.request().query('SELECT 1');
      return pool;
    } catch (err) {
      console.warn('⚠️ Existing SQL connection lost. Reconnecting...');
      try {
        await pool.close();
      } catch (_) {} // silently fail if already closed
      pool = null;
    }
  }

  try {
    pool = await sql.connect(config);
    console.log("✅ Connected to Azure SQL");
    return pool;
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    throw err;
  }
}

module.exports = { getPool };
