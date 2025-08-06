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
