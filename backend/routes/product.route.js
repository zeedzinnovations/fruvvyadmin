import express from "express";
import {
  addProduct,
  getProducts,
  deleteProduct,
} from "../controllers/product.contoller.js";

const router = express.Router();

router.post("/products", addProduct);
router.get("/get-products", getProducts);
router.delete("/products/:id", deleteProduct);

export default router;
