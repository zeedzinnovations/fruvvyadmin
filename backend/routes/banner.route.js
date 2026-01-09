import express from "express";
import {
    addBannerImage,
  getBannerImages
} from "../controllers/banner.controller.js";

const router = express.Router();

router.post("/banners",addBannerImage );
router.get("/get-banners", getBannerImages);


export default router;

