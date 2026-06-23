const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure absolute directory path for volume persistence
const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database connection
const dbPath = path.join(dataDir, 'telemetry.db');
const db = new Database(dbPath);

// Performance optimizations for high-frequency telemetry streams
db.pragma('journal_mode = WAL');   // WAL mode allows non-blocking parallel reads/writes
db.pragma('synchronous = NORMAL');  // Offloads disk-sync bottlenecks to system cache
db.pragma('foreign_keys = ON');    // Enforces data constraints

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS memory_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pid INTEGER NOT NULL,
    mem_kb INTEGER NOT NULL,
    ema_kb REAL NOT NULL,
    slope REAL NOT NULL,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_memory_logs_created ON memory_logs(created_at DESC);
`);

// Cleanup: Delete records older than 7 days every 2 hour
setInterval(() => {
  db.prepare(`
    DELETE FROM memory_logs 
    WHERE created_at < datetime('now', '-7 days')
  `).run();
}, 7200000); // 2 hours

// Cache compiled SQL queries to bypass runtime parsing overhead
const insertStatement = db.prepare(`
  INSERT INTO memory_logs (pid, mem_kb, ema_kb, slope, status)
  VALUES (?, ?, ?, ?, ?)
`);

const queryStatement = db.prepare(`
  SELECT id, pid, mem_kb, ema_kb, slope, status, created_at 
  FROM memory_logs 
  ORDER BY created_at DESC 
  LIMIT ?
`);

module.exports = {
  // Persists telemetry records emitted by the C++ core engine
  save: (data) => {
    try {
      insertStatement.run(data.pid, data.raw_kb, data.ema_kb, data.slope, data.status);
    } catch (err) {
      console.error(err.message); // Fault isolation: protects application runtime loop
    }
  },
  
  // Retrieves historical metric data to pre-populate charts
  getRecent: (limit = 100) => {
    try {
      return queryStatement.all(limit);
    } catch (err) {
      console.error(err.message);
      return [];
    }
  }
};