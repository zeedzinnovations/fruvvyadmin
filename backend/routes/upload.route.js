import express from "express";
import {getCloudinarySignature} from '../controllers/upload.contoller.js'

const router = express.Router();

router.get("/cloudinary-signature", getCloudinarySignature);

export default router;
