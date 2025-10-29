// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    planType: { type: String, enum: ["free", "pro"], default: "free" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);