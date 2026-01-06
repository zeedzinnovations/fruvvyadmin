import bcrypt from "bcrypt";
import pool from "../db/db.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1,$2,$3)
     RETURNING id,name,email,role`,
    [name, email, hashedPassword]
  );

  res.status(201).json({ user: result.rows[0] });
};

export const getUsersList = async (req, res) => {
  const result = await pool.query(
    "SELECT id,name,email,role FROM users"
  );
  res.json(result.rows);
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, role, password } = req.body;

  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `UPDATE users SET name=$1, role=$2, password=$3 WHERE id=$4
       RETURNING id,name,email,role`,
      [name, role, hashed, id]
    );
    return res.json({ user: result.rows[0] });
  }

  const result = await pool.query(
    `UPDATE users SET name=$1, role=$2 WHERE id=$3
     RETURNING id,name,email,role`,
    [name, role, id]
  );

  res.json({ user: result.rows[0] });
};

export const deleteUser = async (req, res) => {
  await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
  res.json({ message: "User deleted" });
};


// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import pool from "../db/db.js";

// /* ===============================
//    INLINE AUTH MIDDLEWARE
// ================================ */
// const authMiddleware = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = {
//       id: decoded.id,
//       role: decoded.role,
//     };

//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// };

// /* ===============================
//    SIGNUP
// ================================ */
// export const signup = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({
//         error: "Name, email and password are required",
//       });
//     }

//     const userExists = await pool.query(
//       "SELECT id FROM users WHERE email = $1",
//       [email]
//     );

//     if (userExists.rows.length > 0) {
//       return res.status(400).json({
//         error: "Email already exists",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await pool.query(
//       `INSERT INTO users (name, email, password, role)
//        VALUES ($1, $2, $3, 'ADMIN')
//        RETURNING id, name, email, role, created_at`,
//       [name, email, hashedPassword]
//     );

//     res.status(201).json({
//       message: "User created successfully",
//       user: result.rows[0],
//     });
//   } catch (err) {
//     console.error("Signup Error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// /* ===============================
//    GET USERS LIST (AUTH REQUIRED)
// ================================ */
// export const getUsersList = [
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const result = await pool.query(
//         `SELECT id, name, email, role, created_at
//          FROM users
//          ORDER BY created_at DESC`
//       );

//       res.status(200).json(result.rows);
//     } catch (err) {
//       console.error("Get Users Error:", err);
//       res.status(500).json({ error: "Failed to fetch users" });
//     }
//   },
// ];

// /* ===============================
//    UPDATE USER (SUPERADMIN ONLY)
// ================================ */
// export const updateUser = [
//   authMiddleware,
//   async (req, res) => {
//     try {
//       if (req.user.role !== "SUPERADMIN") {
//         return res.status(403).json({ error: "Access denied" });
//       }

//       const { id } = req.params;
//       const { name, role, password } = req.body;

//       let query;
//       let values;

//       if (password) {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         query = `
//           UPDATE users
//           SET name = $1,
//               role = $2,
//               password = $3
//           WHERE id = $4
//           RETURNING id, name, email, role
//         `;
//         values = [name, role, hashedPassword, id];
//       } else {
//         query = `
//           UPDATE users
//           SET name = $1,
//               role = $2
//           WHERE id = $3
//           RETURNING id, name, email, role
//         `;
//         values = [name, role, id];
//       }

//       const result = await pool.query(query, values);

//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       res.json({
//         message: "User updated successfully",
//         user: result.rows[0],
//       });
//     } catch (err) {
//       console.error("Update User Error:", err);
//       res.status(500).json({ error: "Update failed" });
//     }
//   },
// ];

// /* ===============================
//    DELETE USER (SUPERADMIN ONLY)
// ================================ */
// export const deleteUser = [
//   authMiddleware,
//   async (req, res) => {
//     try {
//       if (req.user.role !== "SUPERADMIN") {
//         return res.status(403).json({ error: "Access denied" });
//       }

//       const { id } = req.params;

//       // prevent self-delete
//       if (req.user.id === Number(id)) {
//         return res.status(400).json({
//           error: "You cannot delete your own account",
//         });
//       }

//       await pool.query("DELETE FROM users WHERE id = $1", [id]);

//       res.json({ message: "User deleted successfully" });
//     } catch (err) {
//       console.error("Delete User Error:", err);
//       res.status(500).json({ error: "Delete failed" });
//     }
//   },
// ];
