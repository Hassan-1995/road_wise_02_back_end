const pool = require("../db/client");

exports.getAllDrivers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        driver.*, 
        user.name, 
        user.phone, 
        user.email 
      FROM driver
      JOIN user ON driver.userId = user.id
      `);
    res.json(rows);
  } catch (error) {
    console.error("Driver Query error:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.getDriverByID = async (req, res) => {
  const driverID = req.params.driverID;
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        driver.id, 
        name, 
        phone,
        cnicNumber, 
        gender, 
        residenceArea, 
        licenseNumber, 
        dateOfBirth, 
        user.createdAt
      FROM driver
      JOIN user ON user.id = driver.userId 
      WHERE driver.id = ?`,
      [driverID]
    );
    res.json(rows);
  } catch (error) {
    console.error("Driver By Driver ID Query error:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// ON HOLD
exports.onboradDriver = async (req, res) => {
  const driver = req.body;

  if (!driver.userId || !driver.cnicNumber || !driver.licenseNumber) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: User-Id, CNIC and License-Number.",
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO driver (
        userId,
        cnicNumber,
        gender,
        residenceArea,
        licenseNumber,
        status,
        dateOfBirth,
        createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        driver.userId,
        driver.cnicNumber,
        driver.gender || null,
        driver.residenceArea || null,
        driver.licenseNumber,
        driver.status || "Pending",
        driver.dateOfBirth || null,
        new Date(), // createdAt
      ]
    );

    res.status(201).json({
      success: true,
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Insert new-driver entry failed:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
