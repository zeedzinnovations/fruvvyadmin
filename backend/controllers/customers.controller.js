import pool from "../db/db.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateUser = (req, res, next) => {
  const token = req.headers.accesstoken;

  if (!token) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};

//user profile(create,update,fetch)

export const UserProfile = async (req, res) => {
  try {
    const customerId = req.headers.id;

    if (!customerId) {
      return res.status(400).json({ status: 0, message: "id header required" });
    }

    const body = req.body || {};
    const address = body.address || {};
    const isBodyEmpty = Object.keys(body).length === 0;

   
    const exists = await pool.query(
      `SELECT 
        id, name, email, phone_number, gender, dob::date AS dob,
        city, state, country, pincode, created_at
       FROM customers WHERE id = $1`,
      [customerId]
    );

 
    //fetch

    if (isBodyEmpty && exists.rows.length) {
      return res.json({
        status: 1,
        message: "Customer profile fetched successfully",
        data: formatUser(exists.rows[0]),
      });
    }

   //insert
    if (!exists.rows.length) {
      await pool.query(
        `INSERT INTO customers
        (id, name, email, phone_number, gender, dob, city, state, country, pincode)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          customerId,
          body.name || null,
          body.email || null,
          body.phone || null,
          body.gender || null,
          body.dob || null,
          address.city || null,
          address.state || null,
          address.country || null,
          address.pincode || null,
        ]
      );
    }


//upadte


    if (!isBodyEmpty) {
      const updates = {
        name: body.name,
        email: body.email,
        phone_number: body.phone,
        gender: body.gender,
        dob: body.dob,
        city: address.city,
        state: address.state,
        country: address.country,
        pincode: address.pincode,
      };

      Object.keys(updates).forEach(
        key =>
          (updates[key] === undefined || updates[key] === "") &&
          delete updates[key]
      );

      if (Object.keys(updates).length) {
        const fields = Object.keys(updates);
        const values = Object.values(updates);

        const setQuery = fields
          .map((f, i) => `${f} = $${i + 1}`)
          .join(", ");

        await pool.query(
          `UPDATE customers SET ${setQuery} WHERE id = $${fields.length + 1}`,
          [...values, customerId]
        );
      }
    }

  
    const result = await pool.query(
      `SELECT 
        id, name, email, phone_number, gender, dob::date AS dob,
        city, state, country, pincode, created_at
       FROM customers WHERE id = $1`,
      [customerId]
    );

    return res.json({
      status: 1,
      message: "Customer profile fetched successfully",
      data: formatUser(result.rows[0]),
    });

  } catch (err) {
    console.error("UserProfile error:", err);
    return res.status(500).json({ status: 0, message: "Profile failed" });
  }
};

// get customers List 
export const getUsersList = async (req, res) => {
  try {
    const { accesstoken, id } = req.headers;

    let query = `
      SELECT
        id,
        phone_number,
        name,
        email,
        gender,
        dob::date AS dob,
        city,
        state,
        country,
        pincode,
        created_at
      FROM customers
    `;
    const params = [];

    if (accesstoken && id) {
      jwt.verify(accesstoken, JWT_SECRET);
      query += " WHERE id = $1";
      params.push(id);
    }

    const result = await pool.query(query, params);

    res.json(
      result.rows.map(formatUser)
    );
  } catch (err) {
    console.error("getUsersList error:", err);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};


const formatUser = (user) => ({
  customerId: user.id,
  name: user.name ?? "",
  email: user.email || "",
  phone: user.phone_number || "",
  gender: user.gender || "",
  dob: user.dob || "",
  address: {
    city: user.city || "",
    state: user.state || "",
    country: user.country || "",
    pincode: user.pincode || "",
  },
  created_at: user.created_at,
});
