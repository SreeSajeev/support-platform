const express = require('express');
const sql = require('mssql');
const router = express.Router();

// SQL Server Configuration
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

// Connection Pool Reuse
let pool;
async function getPool() {
  if (pool) {
    try {
      await pool.request().query('SELECT 1');
      return pool;
    } catch {
      pool = null; // Reset on failed connection
    }
  }
  pool = await sql.connect(config);
  return pool;
}

// Root Route
router.get('/', (req, res) => {
  res.send('🛠️ IT Helpdesk API running');
});

// Fetch All Tickets (Ordered by Date Descending)
router.get('/tickets', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM AllTickets ORDER BY Date DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching tickets:', err);
    res.status(500).json({ error: 'Error fetching tickets' });
  }
});

// Assign Ticket to User
router.put('/tickets/:id/assign', async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  try {
    const pool = await getPool();

    // Check if ticket exists and is unassigned
    const result = await pool.request()
      .input('id', sql.VarChar, id)
      .query('SELECT AssignedTo FROM AllTickets WHERE UniqueID = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const assignedTo = result.recordset[0].AssignedTo;
    if (assignedTo && assignedTo.trim() !== '') {
      return res.status(400).json({ message: 'Ticket already assigned' });
    }

    // Assign user
    await pool.request()
      .input('id', sql.VarChar, id)
      .input('user', sql.VarChar, user)
      .query('UPDATE AllTickets SET AssignedTo = @user WHERE UniqueID = @id');

    res.json({ message: 'Ticket assigned successfully' });
  } catch (err) {
    console.error('❌ Error assigning ticket:', err);
    res.status(500).json({ message: 'Assignment failed' });
  }
});

module.exports = router;
