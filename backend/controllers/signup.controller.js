import bcrypt from "bcrypt";
import pool from "../db/db.js";


export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All fields (name, email, password) are required",
      });
    }

    const userExists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

  
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword]
    );

  
    return res.status(201).json({
      message: "Signup successful. Await role assignment.",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Signup Error:", err);


    if (err.code === "23505") {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    return res.status(500).json({
      error: "Server error",
    });
  }
};

export const getUsersList = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users"
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Get Users Error:", err);
    return res.status(500).json({
      error: "Failed to fetch users list",
    });
  }
};
