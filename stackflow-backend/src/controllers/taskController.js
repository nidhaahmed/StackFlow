import Task from "../models/Task.js";
import Milestone from "../models/Milestone.js";
import Project from "../models/Project.js";

export const createTask = async (req, res) => {
  try {
    const { title, assignedTo } = req.body;
    const { milestoneId } = req.params;

    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    const task = await Task.create({
      title,
      milestoneId,
      assignedTo, // teammate user id
    });

    // Add task to milestone
    milestone.tasks.push(task._id);
    await milestone.save();

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    console.error("Task creation error:", err);
    res.status(500).json({ message: "Server error creating task" });
  }
};

export const getTasksForMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;

    const tasks = await Task.find({ milestoneId }).populate(
      "assignedTo",
      "name email role"
    );

    res.status(200).json({ tasks });
  } catch (err) {
    console.error("Fetching tasks error:", err);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
};

// QUEUE (simple array for now — will replace with Redis later)
let verificationQueue = [];

export const completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only assigned teammate can complete
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not assigned to this task" });
    }

    // Mark task as completed
    task.status = "completed";
    task.verificationQueue = true;
    await task.save();

    // Push ID to queue
    verificationQueue.push(taskId);

    res.status(200).json({
      message: "Task submitted for verification",
      queueLength: verificationQueue.length,
    });

  } catch (err) {
    console.error("Task completion error:", err);
    res.status(500).json({ message: "Server error completing task" });
  }
};

export const verifyNextTask = async (req, res) => {
  try {
    if (verificationQueue.length === 0) {
      return res.status(200).json({ message: "No tasks in queue" });
    }

    // Pop first element (QUEUE: FIFO)
    const taskId = verificationQueue.shift();

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const milestone = await Milestone.findById(task.milestoneId);
    if (!milestone)
      return res.status(404).json({ message: "Milestone not found" });

    // Ensure tech lead assigned to milestone
    if (milestone.assignedTo.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to verify this task" });
    }

    // Update task status
    task.status = "verified";
    task.verificationQueue = false;
    await task.save();

    // Update Milestone progress
    const totalTasks = milestone.tasks.length;
    const verifiedTasks = await Task.countDocuments({
      milestoneId: milestone._id,
      status: "verified",
    });

    milestone.progress = Math.round((verifiedTasks / totalTasks) * 100);
    await milestone.save();

    // Update Project progress
    const project = await Project.findById(milestone.projectId);
    const milestones = await Milestone.find({ projectId: project._id });

    let sum = 0;
    milestones.forEach((m) => (sum += m.progress));
    project.progress = Math.round(sum / milestones.length);
    await project.save();

    res.status(200).json({
      message: "Task verified successfully",
      verifiedTask: taskId,
      milestoneProgress: milestone.progress,
      projectProgress: project.progress,
    });
  } catch (err) {
    console.error("Task verification error:", err);
    res.status(500).json({ message: "Server error verifying task" });
  }
};
