import express from "express";
import { getDashboardCounts } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/dashboard-counts", getDashboardCounts);

export default router;
