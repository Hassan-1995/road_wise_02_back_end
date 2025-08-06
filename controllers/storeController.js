const pool = require("../db/client");

exports.getAllStore = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * 
      FROM store
      `);
    res.json(rows);
  } catch (error) {
    console.error("Store Query error:", error);
    res.status(500).json({ error: "Database error" });
  }
};
