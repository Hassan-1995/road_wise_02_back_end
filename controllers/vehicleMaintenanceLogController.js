const pool = require("../db/client");

exports.getVehicleMaintenanceLogID = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
        SELECT 
            vehicle.*,
            vehiclemaintenancelog.maintenanceDate,
            vehiclemaintenancelog.liters,
            vehiclemaintenancelog.serviceType,
            vehiclemaintenancelog.repairType,
            vehiclemaintenancelog.costRs,
            vehiclemaintenancelog.odometerKm,
            vehiclemaintenancelog.location,
            vehiclemaintenancelog.notes,
            user.name
        FROM vehicle 
        JOIN vehiclemaintenancelog ON vehiclemaintenancelog.vehicleId = vehicle.id
        JOIN driver ON vehiclemaintenancelog.driverId = driver.id
        JOIN user ON driver.userId = user.id`
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // res.json(rows[0]);
    res.json(rows);
  } catch (error) {
    console.error("Vehicle Query error:", error);
    res.status(500).json({ error: "Database error" });
  }
};
