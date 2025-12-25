import Task from "../models/Task.js";
import Milestone from "../models/Milestone.js";
import Project from "../models/Project.js";
import { taskQueue } from "../queues/taskQueue.js";
import User from "../models/User.js";

export const createTask = async (req, res) => {
  try {
    const { title, assignedToEmail } = req.body;
    const { milestoneId } = req.params;

    if (!title || !assignedToEmail) {
      return res
        .status(400)
        .json({ message: "Title & teammate email required" });
    }

    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

     const user = await User.findOne({
       email: assignedToEmail,
       orgId: req.user.orgId,
       role: "teammate",
     });

     if (!user) {
       return res.status(400).json({
         message: "Teammate not found in your organization",
       });
     }

    const task = await Task.create({
      title,
      milestoneId,
      assignedTo: user._id, // teammate user id
      orgId: req.user.orgId,
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

    const tasks = await Task.find({ 
      milestoneId,
      orgId: req.user.orgId 
    }).populate(
      "assignedTo",
      "name email role"
    );

    res.status(200).json({ tasks });
  } catch (err) {
    console.error("Fetching tasks error:", err);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
};

export const completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not assigned to this task" });
    }

    task.status = "completed";
    await task.save();

    // Push job into Redis queue
    await taskQueue.add("verifyTask", {
      taskId: task._id.toString(),
    }, {
      attempts: 3,
      backoff: {
        type: "exponential", // Automatic retry with exponential backoff
        delay: 2000,
      },
      removeOnFail: false, // DLQ capture failed jobs
      delay: 3000, // 3 seconds delay before processing
    });

    res.status(200).json({
      message: "Task submitted for verification",
    });

  } catch (err) {
    console.error("Task completion error:", err);
    res.status(500).json({ message: "Server error completing task" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate("assignedTo", "name email")
      .populate({
        path: "milestoneId",
        select: "title progress projectId",
        populate: {
          path: "projectId",
          select: "name description orgId",
          populate: {
            path: "orgId",
            select: "name admin",
          },
        },
      });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ task });
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ message: "Server error fetching task" });
  }
};

export const verifyTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // only techlead can verify
    if (req.user.role !== "techlead" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only Tech Lead can verify" });
    }

    task.status = "verified";
    await task.save();

    await updateMilestoneProgress(task.milestoneId);

    res.status(200).json({
      message: "Task verified successfully",
      task,
    });
  } catch (err) {
    console.error("Task verification error:", err);
    res.status(500).json({ message: "Server error verifying task" });
  }
};

export const unverifyTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "techlead" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only techlead can unverify" });
    }

    task.status = "completed";
    await task.save();

    await updateMilestoneProgress(task.milestoneId);

    res.json({ message: "Task moved back to completed" });
  } catch (err) {
    res.status(500).json({ message: "Server error un-verifying task" });
  }
};

export const undoCompleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.assignedTo.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your task" });

    task.status = "pending";
    await task.save();

    // progress should not update until verification; safe to skip here

    res.json({ message: "Task reverted to pending" });
  } catch (err) {
    res.status(500).json({ message: "Error reverting task" });
  }
};

async function updateMilestoneProgress(milestoneId) {
  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) return;

  const total = milestone.tasks.length;
  const verifiedCount = await Task.countDocuments({
    milestoneId,
    status: "verified",
  });

  milestone.progress =
    total === 0 ? 0 : Math.round((verifiedCount / total) * 100);
  await milestone.save();
}

export const deleteTask = async (req, res) => {
  try {
   const { taskId } = req.params;
   const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // only techlead or admin can delete
    if (req.user.role !== "techlead" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only techlead/admin can delete" });
    }

    // remove from milestone.tasks array
    await Milestone.findByIdAndUpdate(task.milestoneId, {
      $pull: { tasks: taskId },
    });

    await Task.findByIdAndDelete(taskId);

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting task" });
  }
};
