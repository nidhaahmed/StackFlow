import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

// dotenv.config({ path: path.resolve("stackflow-backend/.env") });
dotenv.config();
console.log("DB_URI:", process.env.DB_URI); 

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("StackFlow backend running 🚀"));

// MongoDB connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));