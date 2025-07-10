
const Subtask = require('../Models/Subtask');
const Task = require('../Models/Task');
const User = require('../Models/User');
// Create a new subtask
const createSubtask = async (req, res) => {
  try {
    const {
      name,
      startDate,
      endDate,
      duration,
      status,
      assignedTo,
      priority,
      predecessor,
      parentTaskId,
    } = req.body;

    // Check if the parent task exists
    const parentTask = await Task.findById(parentTaskId);
    if (!parentTask) {
      return res.status(404).json({ message: 'Parent task not found' }); // Return if parent task not found
    }

    // Create the new subtask
    const subtask = new Subtask({
      name,
      startDate,
      endDate,
      duration,
      status,
      assignedTo,
      priority,
      predecessor,
      parentTaskId,
    });

    // Save the subtask
    await subtask.save();

    // Push the new subtask's ID to the parent task's subtasks array
    parentTask.subtasks.push(subtask._id);

    // Save the updated parent task
    await parentTask.save();

    // Notify users assigned to the subtask
    const usersToNotify = [];

    assignedTo.forEach((userId) => {
      // If the user is newly assigned to the subtask, we add them to the notification list
      usersToNotify.push(userId);
    });

    // Create notifications for the users assigned to the subtask
    for (const userId of usersToNotify) {
      const user = await User.findById(userId);
      if (user) {
        const notificationMessage = `You have been assigned to a new subtask: ${subtask.name} in the parent task: ${parentTask.name}`;

        // Create the notification object
        const notification = {
          message: notificationMessage,
          type: 'info', // Notification type (can be customized)
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

    // Return the newly created subtask with a success response
    return res.status(201).json(subtask); // Return the subtask as JSON

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error creating subtask' }); // Return an error message if any error occurs
  }
};

const getSubtasksByTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    
    // Find subtasks by parent task ID
    const subtasks = await Subtask.find({ parentTaskId: taskId }).sort({ subtaskOrder: 1 });

    if (!subtasks.length) {
      return res.status(404).json({ message: 'No subtasks found for this task' });
    }

    return res.status(200).json(subtasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching subtasks' });
  }
};

// Get a specific subtask by ID
const getSubtaskById = async (req, res) => {
  try {
    const subtaskId = req.params.subtaskId;
    
    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    return res.status(200).json(subtask);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching subtask' });
  }
};

// Update a subtask
const updateSubtask = async (req, res) => {
  try {
    const subtaskId = req.params.subtaskId;
    const updatedData = req.body;  // Get the full subtask data from the request body

    // Find the subtask to update
    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    // Track which fields have changed to generate meaningful notifications
    const changes = [];
    Object.keys(updatedData).forEach(key => {
      if (subtask[key] !== updatedData[key]) {
        changes.push({ field: key, oldValue: subtask[key], newValue: updatedData[key] });
        subtask[key] = updatedData[key];  // Update each field in the subtask document
      }
    });

    // Save the updated subtask
    await subtask.save();

    // If the status was updated, check if the task's status needs to be updated
    if (updatedData.status) {
      // Retrieve the parent task ID
      const task = await Task.findById(subtask.task);  // Assuming 'task' is the reference to the parent task
      if (task) {
        // Retrieve all subtasks for this task
        const subtasks = await Subtask.find({ task: task._id });

        // Check if all subtasks have the same status
        const allSameStatus = subtasks.every(sub => sub.status === updatedData.status);

        // If all subtasks have the same status, update the task's status
        if (allSameStatus) {
          task.status = updatedData.status; // Update the task status to match subtasks
          await task.save(); // Save the updated task
        }
      }
    }

    // If there were changes, notify the assigned users
    if (changes.length > 0) {
      const usersToNotify = subtask.assignedTo;  // Get the users assigned to this subtask

      for (const userId of usersToNotify) {
        const user = await User.findById(userId);
        if (user) {
          // Construct a notification message based on the changes
          const notificationMessage = `The subtask "${subtask.name}" has been updated. Changes: ` +
            changes.map(change => `${change.field} was changed from "${change.oldValue}" to "${change.newValue}"`).join(', ');

          // Create the notification object
          const notification = {
            message: notificationMessage,
            type: 'info', // Notification type (can be customized)
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
    }

    // Return the updated subtask
    return res.status(200).json(subtask);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating subtask' });
  }
};



// Delete a subtask
const deleteSubtask = async (req, res) => {
  try {
    const subtaskId = req.params.subtaskId;

    const subtask = await Subtask.findByIdAndDelete(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    return res.status(200).json({ message: 'Subtask deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error deleting subtask' });
  }
};
// Add a utility function to get the project creator based on the subtask's parent task
const getProjectCreatorBySubtaskId = async (subtaskId) => {
  try {
    console.log('Subtask ID:', subtaskId); // Log the received subtaskId

    // Find the subtask by its ID
    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      throw new Error('Subtask not found');
    }
    console.log('Subtask Found:', JSON.stringify(subtask, null, 2)); // Avoid circular reference by stringifying

    // Find the parent task associated with the subtask
    const parentTask = await Task.findById(subtask.parentTaskId);
    if (!parentTask) {
      throw new Error('Parent task not found');
    }
    console.log('Parent Task Found:', JSON.stringify(parentTask, null, 2)); // Avoid circular reference by stringifying

    // Find the project associated with the parent task
    const project = parentTask.project; // Assuming 'project' is a reference in the parent task model
    if (!project) {
      throw new Error('Project not found');
    }
    console.log('Project ID:', project); // Log the project ID

    // Find the project by ID to get the creator
    const projectDetails = await Project.findById(project);
    if (!projectDetails) {
      throw new Error('Project details not found');
    }
    console.log('Project Details Found:', JSON.stringify(projectDetails, null, 2)); // Avoid circular reference by stringifying

    // Return the creator of the project
    console.log('Project Creator:', projectDetails.creator); // Log the project creator ID
    return projectDetails.creator; // Assuming 'creator' is a field in the project model
  } catch (err) {
    console.error('Error:', err.message); // Log the error message
    console.error(err); // Log the full error for more context
    throw err; // Propagate error to handle it in the calling function
  }
};


module.exports = {
  createSubtask,
  getSubtasksByTask,
  getSubtaskById,
  updateSubtask,
  deleteSubtask,
  getProjectCreatorBySubtaskId,
};
