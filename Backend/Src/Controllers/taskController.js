const Task = require("../Models/Task");
const Subtask = require("../Models/Subtask");
const Project = require("../Models/Project");
const User = require("../Models/User"); // Assuming you have a User model

const createTask = async (req, res) => {
  try {
    const {
      name,
      project, // Project ID
      startDate,
      endDate,
      priority,
      assignedTo,
      subtasks, // Array of subtask objects or IDs
      duration,
    } = req.body;

    // Create the main task
    const newTask = new Task({
      name,
      project,
      startDate,
      endDate,
      priority: priority || "medium",
      assignedTo,
      subtasks: [], // Initialize as an empty array
      duration,
    });

    // Validate and add subtasks if provided
    if (subtasks && Array.isArray(subtasks)) {
      const subtaskIds = [];
      for (const subtask of subtasks) {
        let subtaskId;
        if (subtask._id) {
          // If a subtask ID is provided, add it to the array
          subtaskId = subtask._id;
        } else {
          // If a subtask object is provided, create it as a new subtask
          const newSubtask = new Subtask({
            name: subtask.name,
            startDate: subtask.startDate,
            endDate: subtask.endDate,
            priority: subtask.priority || "medium",
            assignedTo: subtask.assignedTo || [],
            duration: subtask.duration,
            dependencies: subtask.dependencies || [],
            parentTaskId: newTask._id, // Link subtask to parent task
          });
          const savedSubtask = await newSubtask.save(); // Save subtask to DB
          subtaskId = savedSubtask._id; // Get the saved subtask ID
        }
        subtaskIds.push(subtaskId); // Add subtask ID to the list
      }
      newTask.subtasks = subtaskIds; // Assign the subtask IDs to the task
    }

    // Save the main task to the database
    const savedTask = await newTask.save();

    // Add the task ID to the associated project
    await Project.findByIdAndUpdate(
      project,
      { $push: { tasks: savedTask._id } },
      { new: true }
    );

    // Populate the saved task with its subtasks
    const populatedTask = await Task.findById(savedTask._id).populate(
      "subtasks"
    );

    // Create notifications for the users assigned to the task
    for (const userId of assignedTo) {
      const user = await User.findById(userId);
      if (user) {
        const notificationMessage = `You have been assigned a new task: ${name} in the project: ${populatedTask.project.name}`;

        // Create the notification object with user and action
        const notification = {
          message: notificationMessage,
          type: "info",
          status: false, // Initially set to unread
          createdAt: new Date(),
          updatedAt: new Date(),
          user: user._id, // Add user ID
          action: "assigned to a task", // Define the action
        };

        // Push the notification to the user's notifications array
        user.notifications.push(notification);

        // Save the updated user document
        await user.save();
      }
    }

    // Notify the project creator about the new task creation
    const projectCreator = await User.findById(populatedTask.project.creator);
    if (projectCreator) {
      const projectNotificationMessage = `${req.user.firstName} ${req.user.lastName} created a new task: ${name} in your project: ${populatedTask.project.name}`;

      // Create the notification object for the project creator with user and action
      const projectNotification = {
        message: projectNotificationMessage,
        type: "info",
        status: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: req.user._id, // Add the creator user ID
        action: "created a new task", // Define the action
      };

      // Push the notification to the project creator's notifications array
      projectCreator.notifications.push(projectNotification);

      // Save the updated project creator document
      await projectCreator.save();
    }

    // Push a notification to the project itself
    const projectNotificationMessage = `${req.user.firstName} ${req.user.lastName} created a new task: ${name}`;

    const projectNotification = {
      message: projectNotificationMessage,
      type: "info",
      status: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: req.user._id, // Add the creator user ID
      action: "created a new task in the project", // Define the action
    };

    // Find the project and push the notification to its notifications array
    const updatedProject = await Project.findById(project);
    if (updatedProject) {
      updatedProject.notifications.push(projectNotification);
      await updatedProject.save();
    }

    return res.status(201).json({
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({
      message: "Error creating task",
      error: error.message,
    });
  }
};

// Fetch task by ID and populate assignedTo and subtasks
const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
      .populate("assignedTo") // Populate the assigned users
      .populate("subtasks")
      .populate("assignedTo"); // Populate subtasks

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({
      message: "Task fetched successfully",
      task,
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return res.status(500).json({
      message: "Error fetching task",
      error: error.message,
    });
  }
};

const fetchTasksByProjectId = async (req, res) => {
  const { projectId } = req.params;

  try {
    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo") // Populate assigned users for tasks
      .populate("project")
      .populate({
        path: "subtasks", // Populate subtasks
        populate: {
          path: "assignedTo", // Populate assigned users for subtasks
        },
      });

    if (!tasks.length) {
      return res
        .status(404)
        .json({ message: "No tasks found for this project" });
    }

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

const changeTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const validStatuses = ["to do", "in progress", "needs review", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Update the task status
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // If the task is completed, update all subtasks
    if (status === "completed") {
      // Find all subtasks related to this task
      const subtasks = await Subtask.find({ task: taskId });

      // Update each subtask's status to "completed"
      for (const subtask of subtasks) {
        subtask.status = "completed";
        await subtask.save(); // Save the updated subtask
      }
    }

    // Find the project the task belongs to
    const project = await Project.findOne({ tasks: taskId });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Fetch the user from the database using the user ID in req.user._id
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Construct the notification message using the fetched user details
    const notificationMessage = `${user.firstName} ${user.lastName} updated the task status to "${status}"`;

    // Push the notification to the project's notifications array
    project.notifications.push({
      action: notificationMessage,
      user: req.user._id, // Assuming req.user contains the logged-in user's info
      createdAt: new Date(),
      read: false,
    });

    // Save the project with the new notification
    await project.save();

    return res.json({
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    return res.status(500).json({
      message: "Error updating task status",
      error: error.message,
    });
  }
};

const editTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const {
      name,
      startDate,
      endDate,
      priority,
      assignedTo,
      subtasks,
      duration,
      status,
    } = req.body;

    // Find the existing task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Track users who were assigned and unassigned
    const previousAssignedUsers = task.assignedTo;
    const newlyAssignedUsers = assignedTo;

    // Find the updated task and update it
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        name,
        startDate,
        endDate,
        priority,
        assignedTo,
        subtasks,
        duration,
        status,
      },
      { new: true, runValidators: true }
    )
      .populate("subtasks")
      .populate("assignedTo");

    // If task is not found after the update
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Send notifications to users who were assigned to the task
    const usersToNotify = [];

    // Check for new assignments and send notifications
    newlyAssignedUsers.forEach((userId) => {
      if (!previousAssignedUsers.includes(userId)) {
        usersToNotify.push(userId);
      }
    });

    // Check for users who were removed from the task and send notifications
    previousAssignedUsers.forEach((userId) => {
      if (!newlyAssignedUsers.includes(userId)) {
        usersToNotify.push(userId);
      }
    });

    // Create notifications for the users to notify
    for (const userId of usersToNotify) {
      const user = await User.findById(userId);
      if (user) {
        let notificationMessage = "";

        if (newlyAssignedUsers.includes(userId)) {
          notificationMessage = `You have been assigned to the task: ${updatedTask.name} in the project: ${updatedTask.project.name}`;
        } else {
          notificationMessage = `You have been removed from the task: ${updatedTask.name} in the project: ${updatedTask.project.name}`;
        }

        // Create the notification object
        const notification = {
          message: notificationMessage,
          type: "info", // Can be 'info' or other types based on the action
          status: false, // Mark as unread initially
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Push the notification to the user's notifications array
        user.notifications.push(notification);

        // Save the updated user document
        await user.save();
      }
    }

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({
      message: "Error updating task",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find the task by ID
    const task = await Task.findById(taskId).populate("subtasks");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Cascade delete subtasks
    if (task.subtasks && task.subtasks.length > 0) {
      // Delete each subtask associated with this task
      await Subtask.deleteMany({ _id: { $in: task.subtasks } });
    }

    // Delete the task
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Remove the task from the project that it belongs to
    await Project.findByIdAndUpdate(
      deletedTask.project,
      { $pull: { tasks: taskId } }, // Pull the task ID from the project's tasks array
      { new: true }
    );

    return res.status(200).json({
      message: "Task and its subtasks deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({
      message: "Error deleting task",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  fetchTasksByProjectId,
  getTaskById, // Add the new method here
  changeTaskStatus,
  editTask,
  deleteTask,
};
