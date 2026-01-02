import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import productRoutes from "./routes/product.route.js";
// import cloudinaryRoutes from "./routes/cloudinary.route.js";
import login from './routes/login.route.js'
import signup from './routes/signup.route.js'
import { initTables } from "./db/initTables.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fruvvyadmin-1.onrender.com/",
    "https://fruvvyadmin.onrender.com"
   ],
  credentials: true
}));



app.use(express.json());


app.get("/", (req, res) => {
  res.send("Welcome to Fruvvy Backend");
});

app.get("/devapiService", (req, res) => {
  res.send(" Fruvvy Auth Service Running");
});

app.use("/devapiService", authRoutes);
app.use("/signup", signup);
app.use("/login", login);
// app.use("/api", cloudinaryRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initTables();

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(" Server failed to start:", err);
    process.exit(1);
  }
};

startServer();
