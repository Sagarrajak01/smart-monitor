const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'telemetry.db'));

// Schema for memory logs
db.exec(`
  CREATE TABLE IF NOT EXISTS memory_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pid INTEGER,
    mem_kb INTEGER,
    ema_kb REAL,
    slope REAL,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const insert = db.prepare(`
  INSERT INTO memory_logs (pid, mem_kb, ema_kb, slope, status)
  VALUES (?, ?, ?, ?, ?)
`);

module.exports = {
  save: (data) => {
    try {
      insert.run(data.pid, data.raw_kb, data.ema_kb, data.slope, data.status);
    } catch (err) {
      console.error("DB Write Error:", err);
    }
  },
  
  getRecent: (limit = 100) => {
    return db.prepare("SELECT * FROM memory_logs ORDER BY id DESC LIMIT ?").all(limit);
  }
};