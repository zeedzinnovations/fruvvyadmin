import express from "express";
import {
  UserProfile,
  authenticateUser,
  getUsersList
} from "../controllers/customers.controller.js";

const router = express.Router();

router.post("/profile", authenticateUser, UserProfile);
router.get("/profile", getUsersList);

export default router;
