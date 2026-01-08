import express from "express";
import {
  UserProfile,
  authenticateUser,
  getUsersList,
  updateCustomer,
  deleteCustomer
} from "../controllers/customers.controller.js";

const router = express.Router();

router.post("/profile", authenticateUser, UserProfile);
router.get("/profile", getUsersList);
router.put("/customer/:phone", updateCustomer);
router.delete("/customer/:phone", deleteCustomer);

export default router;
