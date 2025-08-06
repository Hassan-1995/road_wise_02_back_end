const pool = require("../db/client");

exports.getAllLivePosition = async (req, res) => {
  try {
    const [rows] = await pool.query(`
        SELECT 
            livetracker.id,
            livetracker.latitude,
            livetracker.longitude,
            livetracker.status,
            livetracker.recordedAt,
            user.name AS driverName,
            vehicle.makeModel,
            vehicle.registrationNumber
        FROM livetracker
        JOIN driver ON livetracker.driverId = driver.id
        JOIN user ON driver.userId = user.id
        JOIN vehicle ON livetracker.vehicleId = vehicle.id
        `);
    res.json(rows);
  } catch (error) {
    console.error("Live Position Query error:", error);
    res.status(500).json({ error: "Database error" });
  }
};
