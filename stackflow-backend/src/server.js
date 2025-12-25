import express from "express";
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
import queueRoutes from "./routes/queueRoutes.js";
import { joinOrganization } from "./controllers/orgController.js";
import orgRoutes from "./routes/orgRoutes.js";

dotenv.config();
console.log("DB_URI:", process.env.DB_URI);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/org", orgRoutes);

app.get("/", (req, res) => res.send("StackFlow backend running :)"));
app.get("/test", (req, res) => res.send("Server is running"));
app.get("/test-projects", async (req, res) => {
  const projects = await Project.find();
  res.json({ count: projects.length });
});

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log(":) MongoDB connected successfully"))
  .catch((err) => console.error("# MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const calling_domain = window.location.hostname;
// if(hostname )