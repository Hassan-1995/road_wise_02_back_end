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
    // const [rows] = await pool.query("SELECT * FROM trip WHERE driverId = ?", [
    const [rows] = await pool.query(
      `
      SELECT 
        trip.*, -- all columns from Trip
        driver.userId,
        user.name,
        vehicle.makeModel,
        vehicle.registrationNumber,
        dropoutassignment.storeId,
        store.storeName
      FROM trip
      JOIN driver ON trip.driverId = driver.id
      JOIN user ON driver.userId = user.id
      JOIN vehicle ON trip.vehicleId = vehicle.id
      LEFT JOIN dropoutassignment ON dropoutassignment.tripId = trip.id
      LEFT JOIN store ON dropoutassignment.storeId = store.id
      WHERE trip.driverId = ?    
      `,
      [driverId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Trips By Driver Query error:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.createNewTrip = async (req, res) => {
  const trip = req.body;

  if (!trip.driverId || !trip.vehicleId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: driverId and vehicleId.",
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO trip (
        vehicleId,
        driverId,
        startTime,
        endTime,
        distanceKm,
        notes,
        status,
        createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        trip.vehicleId,
        trip.driverId,
        trip.startTime || null,
        trip.endTime || null,
        trip.distanceKm || null,
        trip.notes || null,
        trip.status || "In_Progress",
        new Date(), // createdAt
      ]
    );

    res.status(201).json({
      success: true,
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Insert trip entry failed:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
