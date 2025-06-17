const express = require('express');
const sql = require('mssql');
const router = express.Router();

const config = {
  user: 'helpdesk_admin', // or your SQL user
  password: 'Helpdesk123!', // your password
  server: 'localhost',       // no \SQLEXPRESS
  port: 1433,
  database: 'test',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};



let pool;

async function getPool() {
  try {
    if (pool) {
      // Check if connection is still active
      await pool.request().query('SELECT 1');
      return pool;
    }
    pool = await sql.connect(config);
    console.log('Connected to SQL');
    return pool;
  } catch (err) {
    console.error('❌ SQL connection failed:', err.message);
    pool = null; // Reset if it's broken
    throw err;
  }
}
// Test route
router.get('/', (req, res) => {
  res.send('📊 IT Performance Dashboard API is running!');
});

// GET KPIs route for dashboard metrics
router.get('/metrics', async (req, res) => {
  try {
    const pool = await getPool();
    // Calculate metrics from alltickets_table
    const query = `
    SELECT 
      UniqueID AS TicketID,
      Priority,
      ResolutionTime,
      SLACompliance,
      AssignedTo,
      Status,
      CAST(Date AS VARCHAR) as Date
    FROM AllTickets
    WHERE ResolutionTime IS NOT NULL
    ORDER BY Date DESC
`;


    const result = await pool.request().query(query);
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Error fetching metrics:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

// GET route to fetch all tickets, with optional filters for status and assignedTo

router.get('/tickets', async (req, res) => {
  try {
    const pool = await getPool();
    const query = `
      SELECT 
        UniqueID, -- if available
        Priority,
        ResolutionTime,
        SLACompliance,
        AssignedTo,
        Status,
        CAST(Date AS VARCHAR) as Date
      FROM AllTickets
      WHERE ResolutionTime IS NOT NULL
      ORDER BY Date DESC
    `;
    const result = await pool.request().query(query);
    console.log(`✅ Returned ${result.recordset.length} tickets`);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching tickets:', err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

router.get('/metrics', async (req, res) => {
  try {
    const pool = await getPool();
    const query = `
      SELECT Priority, ResolutionTime, SLACompliance, AssignedTo
      FROM AllTickets
      WHERE ResolutionTime IS NOT NULL
    `;
    const result = await pool.request().query(query);
    const data = result.recordset;

    const totalTickets = data.length;
    if (totalTickets === 0) {
      return res.status(200).json({ message: 'No data available' });
    }

    const countByPriority = {
      High: 0,
      Medium: 0,
      Low: 0,
    };

    let totalResolutionTime = 0;
    let totalSLACompliance = 0;
    const assignedCount = {};

    data.forEach(ticket => {
      countByPriority[ticket.Priority] = (countByPriority[ticket.Priority] || 0) + 1;
      totalResolutionTime += ticket.ResolutionTime;
      totalSLACompliance += ticket.SLACompliance ? 1 : 0;

      const assignee = ticket.AssignedTo;
      if (assignee) {
        assignedCount[assignee] = (assignedCount[assignee] || 0) + 1;
      }
    });

    const mostActive = Object.entries(assignedCount).sort((a, b) => b[1] - a[1])[0] || ['N/A', 0];

    const metrics = {
      totalTickets,
      highPriorityTickets: countByPriority.High || 0,
      mediumPriorityTickets: countByPriority.Medium || 0,
      lowPriorityTickets: countByPriority.Low || 0,
      avgResolutionTime: parseFloat((totalResolutionTime / totalTickets).toFixed(2)),
      slaCompliancePercent: parseFloat(((totalSLACompliance / totalTickets) * 100).toFixed(2)),
      mostActiveMember: mostActive[0],
      mostActiveTicketCount: mostActive[1]
    };

    res.status(200).json(metrics);
  } catch (err) {
    console.error('❌ Error fetching metrics:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});


module.exports = router;

