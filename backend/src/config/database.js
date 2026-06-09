const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./candidate.db", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("SQLite Connected");
  }
});

db.serialize(() => {
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
});

module.exports = db;


db.all("PRAGMA table_info(candidates)", [], (err, rows) => {
  console.log(rows);
});


db.all("PRAGMA table_info(candidates)", [], (err, rows) => {
  console.table(rows);
});



