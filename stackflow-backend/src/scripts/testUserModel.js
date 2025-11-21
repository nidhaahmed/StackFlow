import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const uri =
  process.env.DB_URI || "mongodb://localhost:27017/stackflow_dev";

const run = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    const temp = await User.create({
      name: "Test User",
      email: `dummy${Date.now()}@example.com`,
      password: "dummy",
    });

    console.log("Created test user id:", temp._id);
    await User.deleteOne({ _id: temp._id });
    console.log("Cleaned up test user");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected");
  }
};

run();