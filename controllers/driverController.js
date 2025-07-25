const pool = require("../db/client");

exports.getAllDrivers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM driver");
    res.json(rows);
  } catch (error) {
    console.error("Driver Query error:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.getDriverByID = async (req, res) => {
  const driverID = req.params.driverID;
  try {
    const [rows] = await pool.query("SELECT * FROM driver WHERE id = ?", [
      driverID,
    ]);
    res.json(rows);
  } catch (error) {
    console.error("Driver By Driver ID Query error:", error);
    res.status(500).json({ error: "Database error" });
  }
};
