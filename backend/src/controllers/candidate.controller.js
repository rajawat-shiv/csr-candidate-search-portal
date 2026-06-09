const XLSX = require("xlsx");
const db = require("../config/database");

function excelDateToJSDate(value) {
  if (!value || value === "NA" || value === "-") {
    return "NA";
  }

  if (isNaN(value)) {
    return value;
  }

  const excelEpoch = new Date(1899, 11, 30);

  const date = new Date(
    excelEpoch.getTime() + value * 24 * 60 * 60 * 1000
  );

  return date.toLocaleDateString("en-GB");
}

const uploadExcel = async (req, res) => {
  try {
    console.log("Upload API Hit");

    const workbook = XLSX.read(
      req.file.buffer,
      {
        type: "buffer",
      }
    );
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
    });

    console.log("FIRST ROW =>", data[0]);

    db.run("DELETE FROM candidates");

    let totalInserted = 0;

    let c1 = 0;
    let c2 = 0;
    let c3 = 0;

    const query = `
  INSERT INTO candidates (
    candidate_name,
    contact_number,
    attendance_app_id,
    ho_id,
    ojt_start_date,
    ojt_end_date,
    lwd,
    vertical_type
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

    data.forEach((row) => {

      // Candidate 1
      if (
        row["Candidate Name"] &&
        row["Candidate Name"] !== "-"
      ) {
        c1++;
        totalInserted++;

        db.run(query, [
          row["Candidate Name"] || "",
          String(row["Contact Number"] || "").replace(".0", ""),
          row["Attendance App ID"] || "",
          row["HO ID"] || "",
          excelDateToJSDate(row["OJT Start Date"]),
          excelDateToJSDate(row["OJT End Date"]),
          excelDateToJSDate(row["LWD"]),
          row["Vertical Type"] || "MX",
        ]);
      }

      // Candidate 2
      if (
        row["Candidate Name_1"] &&
        row["Candidate Name_1"] !== "-"
      ) {
        c2++;
        totalInserted++;

        db.run(query, [
          row["Candidate Name_1"] || "",
          String(row["Contact Number_1"] || "").replace(".0", ""),
          row["Attendance App ID_1"] || "",
          row["HO ID_1"] || "",
          excelDateToJSDate(row["OJT start date"]),
          excelDateToJSDate(row["OJT end date"]),
          excelDateToJSDate(row["LWD_1"]),
          row["Vertical Type"] || "MX",
        ]);
      }

      // Candidate 3
      if (
        row["Candidate Name_2"] &&
        row["Candidate Name_2"] !== "-"
      ) {
        c3++;
        totalInserted++;

        db.run(query, [
          row["Candidate Name_2"] || "",
          String(row["Contact Number_2"] || "").replace(".0", ""),
          row["Attendance App ID_2"] || "",
          row["HO ID_2"] || "",
          excelDateToJSDate(row["OJT start date_1"]),
          excelDateToJSDate(row["OJT end date_1"]),
          excelDateToJSDate(row["LWD_2"]),
          row["Vertical Type"] || "MX",
        ]);
      }
    });



    res.status(200).json({
      success: true,
      message: `${totalInserted} candidates imported`,
      stats: {
        candidate1: c1,
        candidate2: c2,
        candidate3: c3,
        total: totalInserted,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchCandidate = (req, res) => {
  const { q } = req.query;

  const sql = `
    SELECT *
    FROM candidates
    WHERE
      contact_number LIKE ?
      OR candidate_name LIKE ?
      OR attendance_app_id LIKE ?
      OR ho_id LIKE ?
    LIMIT 20
  `;

  const searchValue = `%${q}%`;


  db.all(
    sql,
    [searchValue, searchValue, searchValue, searchValue],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }
      console.log(rows[0]);
      res.json({
        success: true,
        count: rows.length,
        data: rows,
      });
    }
  );
};

const getStats = (req, res) => {
  db.all(
    `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN vertical_type='MX' THEN 1 ELSE 0 END) as mx,
      SUM(CASE WHEN vertical_type='CE' THEN 1 ELSE 0 END) as ce
    FROM candidates
    `,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        data: rows[0],
      });
    }
  );
};

module.exports = {
  uploadExcel,
  searchCandidate,
  getStats,
};