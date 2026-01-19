import pool from "../db/db.js";

export const getDashboardCounts = async (req, res) => {
  try {
    const products = await pool.query("SELECT COUNT(*) FROM products");
    const categories = await pool.query("SELECT COUNT(*) FROM categories");
    const customers = await pool.query("SELECT COUNT(*) FROM customers");
     const mega_offers = await pool.query("SELECT COUNT(*) FROM mega_offers");

    res.json({
      products: Number(products.rows[0].count),
      categories: Number(categories.rows[0].count),
      customers: Number(customers.rows[0].count),
      mega_offers: Number(mega_offers.rows[0].count)

    });
  } catch (err) {
    console.error("Dashboard count error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
