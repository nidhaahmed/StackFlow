import Milestone from "../models/Milestone.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

export const createMilestone = async (req, res) => {
  try {
    const { title, assignedToEmail } = req.body;
    const { projectId } = req.params;

    if (!title || !assignedToEmail) {
      return res
        .status(400)
        .json({ message: "Title and Tech lead email required" });
    }

    // Check if project exists
    const project = await Project.findOne({
      _id: projectId,
      orgId: req.user.orgId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Find tech lead by email
    const techLead = await User.findOne({
      email: assignedToEmail,
      orgId: req.user.orgId,
    });

    if(techLead && techLead.role !== "techlead") {
      return res.status(400).json({
        message: "Assigned user is not a tech lead",
      });
    }

    if (!techLead) {
      return res.status(404).json({
        message: "Tech lead not found in your organization",
      });
    }

    // Create milestone
    const milestone = await Milestone.create({
      title,
      projectId,
      assignedTo: techLead._id, // tech lead id
      orgId: req.user.orgId,
    });

    // Push milestone into project.milestones array
    project.milestones.push(milestone._id);
    await project.save();

    res.status(201).json({
      message: "Milestone created successfully",
      milestone,
    });
  } catch (err) {
    console.error("Milestone creation error:", err);
    res.status(500).json({ message: "Server error creating milestone" });
  }
};

export const getMilestonesForProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const milestones = await Milestone.find({
      projectId,
      orgId: req.user.orgId,
    }).populate("assignedTo", "name email role");

    res.status(200).json({ milestones });
  } catch (err) {
    console.error("Fetching milestone error:", err);
    res.status(500).json({ message: "Server error fetching milestones" });
  }
};

export const getMilestoneById = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.milestoneId)
      .populate("tasks")
      .populate("assignedTo", "name email");

    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    res.status(200).json({ milestone });
  } catch (err) {
    console.error("Error fetching milestone:", err);
    res.status(500).json({ message: "Server error fetching milestone" });
  }
};
