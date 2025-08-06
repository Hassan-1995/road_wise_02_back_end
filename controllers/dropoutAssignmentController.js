const pool = require("../db/client");

exports.getDropoutAssignmentByTrip = async (req, res) => {
  const tripId = req.params.tripId;
  try {
    const [rows] = await pool.query(
      `SELECT da.*, s.storename, s.address, s.latitude, s.longitude
         FROM dropoutassignment da
         JOIN store s ON da.storeId = s.id
           WHERE da.tripId = ?`,
      [tripId]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Dropout-Assignment not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error fetching dropoutAssignmentInfo:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getDropoutAssignmentByDriver = async (req, res) => {
  const driverId = req.params.driverId;
  try {
    const [rows] = await pool.query(
      `SELECT da.*, s.storename, s.address, s.latitude, s.longitude
         FROM dropoutassignment da
         JOIN store s ON da.storeId = s.id
         WHERE da.driverId = ?`,
      [driverId]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Dropout-Assignment not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error fetching dropoutAssignmentInfo:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateStoreStatusbyDriver = async (req, res) => {
  const { driverId, storeId, tripId } = req.params;
  const { status } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE dropoutassignment
       SET status = ?
       WHERE driverId = ? AND storeId = ? AND tripId = ?`,
      [status, driverId, storeId, tripId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Dropout-Assignment not found" });
    }
    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating dropoutAssignment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createNewDropoffs = async (req, res) => {
  const dropoutAssignment = req.body;

  if (
    !dropoutAssignment.tripId ||
    !dropoutAssignment.driverId ||
    !dropoutAssignment.storeId
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: tripId, driverId and storeId.",
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO dropoutassignment (
        driverId,
        storeId,
        assignedAt,
        status,
        tripId
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        dropoutAssignment.driverId,
        dropoutAssignment.storeId,
        new Date(), // assignedAt
        dropoutAssignment.status || "Pending",
        dropoutAssignment.tripId,
      ]
    );

    res.status(201).json({
      success: true,
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Insert dropoutAssignment entry failed:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
