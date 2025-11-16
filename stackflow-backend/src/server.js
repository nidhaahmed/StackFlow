import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import projectRoutes from "./routes/projectRoutes.js";
import milestoneRoutes from "./routes/milestoneRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import Project from "./models/Project.js";

// dotenv.config({ path: path.resolve("stackflow-backend/.env") });
dotenv.config();
console.log("DB_URI:", process.env.DB_URI);

const app = express();
app.use(express.json());
app.use(cors());

// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );

// const httpServer = createServer(app);

// const io = new Server(httpServer, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// app.set("io", io);

// io.on("connection", (socket) => {
//   console.log(":) User connected:", socket.id);
// });

app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => res.send("StackFlow backend running 🚀"));
app.get("/test", (req, res) => res.send("Server is running"));
app.get("/test-projects", async (req, res) => {
  const projects = await Project.find();
  res.json({ count: projects.length });
});

// MongoDB connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// httpServer.listen(PORT, () => {
//   console.log('Server running on port', PORT);
// })