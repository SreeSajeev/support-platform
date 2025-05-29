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

async function testConnection() {
  try {
    await sql.connect(config);
    console.log('Connected to Azure SQL successfully!');
  } catch (err) {
    console.error('Connection failed:', err);
  }
  sql.close();
}

testConnection();
