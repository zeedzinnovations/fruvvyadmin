import pool from "../db/db.js";

export const addProduct = async (req, res) => {
  try {
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
      `
      INSERT INTO products
      (name, category_id, price, country, unit, description, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [name, category_id, price, country, unit, description, image_url]
    );

    res.json({ message: "Product added successfully" });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
};


export const getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.category_id,
        c.name AS category_name,
        p.price,
        p.country,
        p.unit,
        p.description,
        p.image_url
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

//update by id
export const updateProduct = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    category_id,
    price,
    country,
    unit,
    description,
    image_url,
  } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE products
      SET
        name = $1,
        category_id = $2,
        price = $3,
        country = $4,
        unit = $5,
        description = $6,
        image_url = $7
      WHERE id = $8
      RETURNING *
      `,
      [name, category_id, price, country, unit, description, image_url, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};
// delete
export const deleteProduct = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
