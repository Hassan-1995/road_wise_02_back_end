const pool = require("../db/client");
const bcrypt = require("bcrypt");

exports.createDriver = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const role = "driver"; // define role here

  try {
    // Check if user already exists
    const [existingUser] = await pool.query(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ message: "User already exists with this email." });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const [result] = await pool.query(
      ` INSERT INTO user 
            (name, role, email, phone, passwordHash) 
        VALUES (?, ?, ?, ?, ?)`,
      [name, role, email, phone, passwordHash]
    );

    res.status(201).json({ id: result.insertId, name, email, role, phone });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
