const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./candidate.db", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("SQLite Connected");

    db.run("PRAGMA journal_mode = WAL");
    db.run("PRAGMA synchronous = NORMAL");
  }
});

db.serialize(() => {

  db.run("PRAGMA journal_mode = WAL");
  db.run("PRAGMA synchronous = NORMAL");

  db.run(`
    CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      candidate_name TEXT,
      contact_number TEXT,
      attendance_app_id TEXT,
      ho_id TEXT,
      ojt_start_date TEXT,
      ojt_end_date TEXT,
      lwd TEXT,
      vertical_type TEXT
    )
  `);

  // Search Performance Indexes

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_contact
    ON candidates(contact_number)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_attendance
    ON candidates(attendance_app_id)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_ho
    ON candidates(ho_id)
  `);

});

module.exports = db;  