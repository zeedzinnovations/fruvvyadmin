import pool from "../db/db.js";

export const addBannerImage = async (req, res) => {
  try {
   

    const { title, image_url } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({ error: "Missing title or image_url" });
    }

    const query = `
      INSERT INTO banners (title, image_url)
      VALUES ($1, $2)
      RETURNING *;
    `;

    const values = [title, image_url];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Banner added successfully",
      banner: result.rows[0],
    });
  } catch (error) {
    console.error("ADD BANNER ERROR:", error);
    res.status(500).json({ error: "Failed to add banner image" });
  }
};

export const getBannerImages = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM banners ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("GET BANNER ERROR:", error);
    res.status(500).json({ error: "Failed to fetch banners" });
  }
};
