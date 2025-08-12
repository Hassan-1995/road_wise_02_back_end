const pool = require("../db/client");

exports.getAllVehicles = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM vehicle");
    res.json(rows);
  } catch (error) {
    console.error("Vehicle Query error:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.getVehicleByID = async (req, res) => {
  const { vehicleID } = req.params;

  try {
    const [rows] = await pool.query("SELECT * FROM vehicle WHERE id = ?", [
      vehicleID,
    ]);

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
// // do not delete this function
// exports.getVehicleByID = async (req, res) => {
//   const { vehicleID } = req.params;

//   try {
//     const [rows] = await pool.query(
//       `
//       SELECT 
//         vehicle.*,
//         vehiclemaintenancelog.maintenanceDate,
//         vehiclemaintenancelog.liters,
//         vehiclemaintenancelog.serviceType,
//         vehiclemaintenancelog.repairType,
// 	      vehiclemaintenancelog.costRs,
//         vehiclemaintenancelog.odometerKm,
//         vehiclemaintenancelog.location,
//         vehiclemaintenancelog.notes,
//         user.name
//       FROM vehicle 
//       JOIN vehiclemaintenancelog ON vehiclemaintenancelog.vehicleId = vehicle.id
//       JOIN driver ON vehiclemaintenancelog.driverId = driver.id
//       JOIN user ON driver.userId = user.id
//       WHERE vehicle.id = ?`,
//       [vehicleID]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ error: "Vehicle not found" });
//     }

//     // res.json(rows[0]);
//     res.json(rows);
//   } catch (error) {
//     console.error("Vehicle Query error:", error);
//     res.status(500).json({ error: "Database error" });
//   }
// };

exports.getVehicleByDriverId = async (req, res) => {
  const driverID = req.params.driverId;
  try {
    const [rows] = await pool.query(
      `
        SELECT 
            vehiclemaintenancelog.id,
            vehiclemaintenancelog.vehicleId AS maintenanceVehicleId,
            vehiclemaintenancelog.driverId,
            vehiclemaintenancelog.maintenanceDate,
            vehiclemaintenancelog.liters,
            vehiclemaintenancelog.serviceType,
            vehiclemaintenancelog.repairType,
            vehiclemaintenancelog.costRs,
            vehiclemaintenancelog.odometerKm,
            vehiclemaintenancelog.location,
            vehiclemaintenancelog.notes,
            vehiclemaintenancelog.createdAt,
            vehicle.vehicleId AS vehicleCode,
            vehicle.makeModel,
            vehicle.registrationNumber
        FROM vehiclemaintenancelog 
        JOIN vehicle ON  vehiclemaintenancelog.vehicleId = vehicle.id
        WHERE vehiclemaintenancelog.vehicleId = (
            SELECT id
            FROM vehicle
            WHERE assignedDriverId=?
            ORDER BY vehicle.createdAt DESC
            LIMIT 1
        )`,
      [driverID]
    );
    res.json(rows);
  } catch (error) {
    console.error("Vehicle By Driver ID Query error:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.insertFuelEntry = async (req, res) => {
  const fuel = req.body;

  if (
    !fuel.vehicleId ||
    !fuel.driverId ||
    !fuel.liters ||
    !fuel.costRs ||
    !fuel.odometerKm
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: vehicleId, driverId, liters, costRs, odometerKm",
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO vehiclemaintenancelog (
        vehicleId,
        driverId,
        maintenanceDate,
        liters,
        costRs,
        odometerKm,
        location,
        notes,
        createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fuel.vehicleId,
        fuel.driverId,
        new Date(), // maintenanceDate
        fuel.liters,
        fuel.costRs,
        fuel.odometerKm,
        fuel.location || null,
        fuel.notes || null,
        new Date(), // createdAt
      ]
    );

    res.status(201).json({
      success: true,
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Insert fuel entry failed:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.insertServiceEntry = async (req, res) => {
  const service = req.body;

  if (
    !service.vehicleId ||
    !service.driverId ||
    !service.serviceType ||
    !service.costRs ||
    !service.odometerKm
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: vehicleId, driverId, serviceType, costRs, odometerKm",
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO vehiclemaintenancelog (
        vehicleId,
        driverId,
        maintenanceDate,
        serviceType,
        costRs,
        odometerKm,
        location,
        notes,
        createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        service.vehicleId,
        service.driverId,
        new Date(), // maintenanceDate
        service.serviceType,
        service.costRs,
        service.odometerKm,
        service.location || null,
        service.notes || null,
        new Date(), // createdAt
      ]
    );

    res.status(201).json({
      success: true,
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Insert service entry failed:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.insertRepairEntry = async (req, res) => {
  const repair = req.body;

  if (
    !repair.vehicleId ||
    !repair.driverId ||
    !repair.repairType ||
    !repair.costRs ||
    !repair.odometerKm
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: vehicleId, driverId, repairType, costRs, odometerKm",
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO vehiclemaintenancelog (
        vehicleId,
        driverId,
        maintenanceDate,
        repairType,
        costRs,
        odometerKm,
        location,
        notes,
        createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        repair.vehicleId,
        repair.driverId,
        new Date(), // maintenanceDate
        repair.repairType,
        repair.costRs,
        repair.odometerKm,
        repair.location || null,
        repair.notes || null,
        new Date(), // createdAt
      ]
    );

    res.status(201).json({
      success: true,
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Insert repair entry failed:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


