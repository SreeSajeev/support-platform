const sql = require('mssql');

const config = {
  user: 'adminuser', // replace with your SQL username
  password: 'BUR123ger@', // replace with your SQL password
  database: 'supportDB',
  server: 'supportserver123.database.windows.net',
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

async function connectToDB() {
  try {
    const pool = await sql.connect(config);
    console.log("Connected to Azure SQL successfully!");
    return pool;
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

module.exports = connectToDB;
