const { readDB } = require('../utils');

// GET /api/logs - Get all audit logs [cite: 170]
exports.getLogs = (req, res) => {
   try {
    const db = readDB();
    // Return logs in reverse chronological order
    const sortedLogs = db.logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.status(200).json(sortedLogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch logs.' });
  }
};