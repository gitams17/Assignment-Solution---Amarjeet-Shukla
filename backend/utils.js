const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

// --- Database Helpers ---

function readDB() {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// --- Audit Log Helper --- [cite: 195]

/**
 * Creates an audit log entry
 * @param {string} action - e.g., 'Create Task', 'Update Task', 'Delete Task'
 * @param {number} taskId - The ID of the task being actioned
 * @param {object | null} updatedContent - The content being added or changed
 */
function logAction(action, taskId, updatedContent = null) {
  const db = readDB();
  
  const newLog = {
    id: db.logs.length + 1,
    timestamp: new Date().toISOString(), // [cite: 198]
    action: action, // [cite: 199]
    taskId: taskId, // [cite: 200]
    updatedContent: updatedContent // [cite: 201]
  };

  db.logs.push(newLog);
  writeDB(db);
}

// --- Input Sanitizer --- [cite: 214, 230]
function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, (match) => {
    return {
      '<': '&lt;',
      '>': '&gt;'
    }[match];
  });
}

module.exports = { readDB, writeDB, logAction, sanitize };