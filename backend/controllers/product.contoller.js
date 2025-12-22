import pool from "../db.js";

export const addProduct = async (req, res) => {
  const {
    name,
    category_id,
    price,
    country,
    unit,
    description,
    image_url,
  } = req.body;

  await pool.query(
    `INSERT INTO products
     (name,category_id,price,country,unit,description,image_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [name, category_id, price, country, unit, description, image_url]
  );

  res.json({ message: "Product added" });
};

export const getProducts = async (req, res) => {
  const result = await pool.query("SELECT * FROM products");
  res.json(result.rows);
};

export const deleteProduct = async (req, res) => {
  await pool.query("DELETE FROM products WHERE id=$1", [req.params.id]);
  res.json({ message: "Product deleted" });
};
