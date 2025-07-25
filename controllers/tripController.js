const pool = require("../db/client");

exports.getAllTrips = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM trip");
    res.json(rows);
  } catch (error) {
    console.error("Trip Query error:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.getTripsByDriver = async (req, res) => {
  const driverId = req.params.driverId;
  try {
    const [rows] = await pool.query("SELECT * FROM trip WHERE driverId = ?", [
      driverId,
    ]);
    res.json(rows);
  } catch (error) {
    console.error("Trips By Driver Query error:", error);
    res.status(500).json({ error: "Database error" });
  }
};
