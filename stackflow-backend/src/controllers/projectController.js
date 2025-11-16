import Project from "../models/Project.js";
import Milestone from "../models/Milestone.js";
import User from "../models/User.js";

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const createdBy = req.user.id;

    const project = await Project.create({
      name,
      description,
      createdBy,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });

    console.log("Project created for user:", createdBy);
  } catch (err) {
    console.error("Project creation error:", err);
    res.status(500).json({ message: "Server error creating project" });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email role")
      .populate("milestones"); // ✅ will now work fine

    res.status(200).json({ projects });
  } catch (err) {
    console.error("Fetching projects error:", err);
    res.status(500).json({ message: "Server error fetching projects" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate("createdBy", "name email role")
      .populate({
        path: "milestones",
        populate: { path: "tasks" },
      });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ message: "Server error fetching project" });
  }
};
