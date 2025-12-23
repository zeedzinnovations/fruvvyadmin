import pool from "../db/db.js";

export const addCategory = async (req, res) => {
  const { name, image_url } = req.body;
  await pool.query(
    "INSERT INTO categories (name,image_url) VALUES ($1,$2)",
    [name, image_url]
  );
  res.json({ message: "Category added" });
};

export const getCategories = async (req, res) => {
  const result = await pool.query("SELECT * FROM categories");
  res.json(result.rows);
};

export const deleteCategory = async (req, res) => {
  await pool.query("DELETE FROM categories WHERE id=$1", [req.params.id]);
  res.json({ message: "Category deleted" });
};
