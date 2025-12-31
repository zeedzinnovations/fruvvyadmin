import express from "express";
import {
    signup,getUsersList
 
} from "../controllers/signup.controller.js";

const router = express.Router();

router.post("/", signup);

router.get("/getUsersList", getUsersList);


export default router;
