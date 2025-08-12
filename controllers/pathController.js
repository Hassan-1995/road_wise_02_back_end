const pool = require("../db/client");

// Create optimised path for a trip
exports.createOptimisedPath = async (req, res) => {
  const path = req.body;

  if (!path.tripId) {
    return res.status(400).json({
      success: false,
      message: "Missing required field: trip_id.",
    });
  }

  try {
    // 1️⃣ Check if trip already has optimisedPath
    const [existing] = await pool.query(
      "SELECT optimisedPath FROM generatedpath WHERE tripId = ? LIMIT 1",
      [path.tripId]
    );

    if (existing.length > 0 && existing[0].optimisedPath) {
      return res.status(200).json({
        success: false,
        message:
          "optimisedPath already exists for this trip. No new entry created.",
      });
    }

    // 2️⃣ Insert new entry if no existing path
    const [result] = await pool.query(
      `INSERT INTO generatedpath (
        tripId,
        optimisedPath,
        distanceKm,
        durationMinutes,
        startTime,
        endTime,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        path.tripId,
        path.optimisedPath || null,
        path.distanceKm || null,
        path.durationMinutes || null,
        path.startTime || new Date(),
        path.endTime || null,
        path.status || "Pending",
      ]
    );

    res.status(201).json({
      success: true,
      insertId: result.insertId,
      message: "Trip entry created successfully.",
    });
  } catch (error) {
    console.error("Insert trip path failed:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateTripStatusOrEndTime = async (req, res) => {
  const { tripId, status, updateEndTime } = req.body;

  if (!tripId) {
    return res.status(400).json({
      success: false,
      message: "Missing required field: tripId.",
    });
  }

  // Allowed status values
  const allowedStatus = ["Pending", "Ongoing", "Completed", "Cancelled"];

  // Build dynamic update fields
  const updates = [];
  const values = [];

  if (updateEndTime) {
    updates.push("endTime = ?");
    values.push(new Date()); // current server time
  }

  if (status) {
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatus.join(", ")}`,
      });
    }
    updates.push("status = ?");
    values.push(status);
  }

  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      message:
        "No fields to update. Set updateEndTime to true and/or provide status.",
    });
  }

  values.push(tripId); // For WHERE clause

  try {
    const [result] = await pool.query(
      `UPDATE generatedpath SET ${updates.join(", ")} WHERE tripId = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trip updated successfully.",
    });
  } catch (error) {
    console.error("Update trip failed:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.insertActualPathPoint = async (req, res) => {
  const point = req.body;

  // Validate required fields
  if (!point.tripId || !point.driverId || !point.latitude || !point.longitude) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: tripId, driverId, latitude, longitude.",
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO actualpathpoint (
        tripId,
        driverId,
        latitude,
        longitude,
        recordedAt,
        sequence,
        speed,
        heading
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        point.tripId,
        point.driverId,
        point.latitude,
        point.longitude,
        point.recordedAt || new Date(),
        point.sequence || null, // optional
        point.speed || null, // optional
        point.heading || null, // optional
      ]
    );

    res.status(201).json({
      success: true,
      insertId: result.insertId,
      message: "Actual path point recorded successfully.",
    });
  } catch (error) {
    console.error("Insert actual path point failed:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get optimised path for a trip
exports.getOptimisedPath = async (req, res) => {
  const { tripID } = req.params;

  if (!tripID) {
    return res.status(400).json({
      success: false,
      message: "Missing required parameter: tripId.",
    });
  }

  try {
    const [rows] = await pool.query(
      `SELECT tripId, optimisedPath, distanceKm, durationMinutes, 
              startTime, endTime, status
       FROM generatedpath
       WHERE tripId = ?
       LIMIT 1`,
      [tripID]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No optimised path found for this trip.",
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Fetch optimised path failed:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
