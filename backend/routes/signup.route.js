import express from "express";
import {
    signup,getUsersList
 
} from "../controllers/signup.controller.js";

const router = express.Router();

router.post("/", signup);

router.get("/getUsersList", getUsersList);


export default router;
// import express from "express";
// import {
//   signup,
//   getUsersList,
//   updateUser,
//   deleteUser,
// } from "../controllers/signup.controller.js";

// const router = express.Router();

// router.post("/", signup);
// router.get("/getUsersList", getUsersList);
// router.put("/:id", updateUser);
// router.delete("/:id", deleteUser);

// export default router;
