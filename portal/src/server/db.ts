import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "../../data/portal.db");

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH, {});
    db.pragma("journal_mode = WAL");
    db.pragma("synchronous = NORMAL");
    db.pragma("cache_size = -64000"); // 64MB
    db.pragma("busy_timeout = 5000");
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      hostname TEXT NOT NULL,
      platform TEXT DEFAULT '',
      last_seen TEXT NOT NULL,
      status TEXT DEFAULT 'offline',
      extensions_json TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      device_id TEXT NOT NULL,
      project TEXT DEFAULT '',
      branch TEXT DEFAULT '',
      cwd TEXT DEFAULT '',
      status TEXT DEFAULT 'active',
      started_at TEXT NOT NULL,
      ended_at TEXT,
      model TEXT DEFAULT '',
      token_input INTEGER DEFAULT 0,
      token_output INTEGER DEFAULT 0,
      token_cache_read INTEGER DEFAULT 0,
      token_cache_write INTEGER DEFAULT 0,
      cost_usd REAL DEFAULT 0.0,
      tool_calls INTEGER DEFAULT 0,
      current_activity TEXT DEFAULT '',
      events_count INTEGER DEFAULT 0,
      FOREIGN KEY (device_id) REFERENCES devices(id)
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      tool_name TEXT,
      agent_id TEXT,
      parent_agent_id TEXT,
      payload_json TEXT DEFAULT '{}',
      timestamp TEXT NOT NULL,
      FOREIGN KEY (device_id) REFERENCES devices(id),
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    );

    CREATE TABLE IF NOT EXISTS token_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      input_tokens INTEGER DEFAULT 0,
      output_tokens INTEGER DEFAULT 0,
      cache_read INTEGER DEFAULT 0,
      cache_write INTEGER DEFAULT 0,
      cost_usd REAL DEFAULT 0.0,
      model TEXT DEFAULT '',
      timestamp TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_device ON sessions(device_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
    CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);
    CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
    CREATE INDEX IF NOT EXISTS idx_token_snapshots_device ON token_snapshots(device_id);
    CREATE INDEX IF NOT EXISTS idx_token_snapshots_timestamp ON token_snapshots(timestamp);
  `);
}
