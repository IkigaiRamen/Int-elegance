const Project = require("../Models/Project");
const cloudinary = require("cloudinary").v2;
const Company= require("../Models/Company");
const User = require("../Models/User");
// Configure Cloudinary
cloudinary.config({
  cloud_name: "drexcmawh",
  api_key: "749992466314972",
  api_secret: "p0Bz1rVzCyVtVWX9ZafYpyl5UgY", // Replace with your actual API secret
});

// Create a new project
const createProject = async (req, res) => {
  try {
    const { name, category, startDate, endDate, priority, description, users } = req.body;
    const creator = req.user._id; // Assuming user ID is set in the token

    // Prepare project data
    const projectData = {
      name,
      category,
      startDate,
      endDate,
      priority,
      description,
      users,
      creator,
    };

    // Create the new project
    const newProject = await Project.create(projectData);

    // Find the company associated with the creator
    const company = await Company.findOne({ creator });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Push the new project to the company's projects array
    company.projects.push(newProject._id);

    // Save the updated company document
    await company.save();

    // Push notifications to each user assigned to the project
    for (let userId of users) {
      const user = await User.findById(userId);
      
      if (user) {
        // Create the notification message for the user
        const notificationMessage = `You have been assigned to a new project: ${newProject.name}`;

        // Create the notification object
        const notification = {
          message: notificationMessage,
          type: 'info', // You can adjust the type as needed
          status: false, // Initially set to unread
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Push the notification to the user's notifications array
        user.notifications.push(notification);

        // Save the updated user document
        await user.save();
      }
    }

    // Respond with the newly created project
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error occurred while creating project:", error);
    res.status(500).json({ message: "Error creating project" });
  }
};



const getProjectById = async (req, res) => {
  const { id } = req.params; // Get the project ID from the request parameters

  try {
    // Find the project by ID and populate the users, tasks, and subtasks fields
    const project = await Project.findById(id)
      .populate("users") // Populate the 'users' field
      .populate({
        path: "tasks",      // Populate the 'tasks' field
        populate: [
          {
            path: "assignedTo", // Populate 'assignedTo' field inside each task
            model: "User",      // Ensure it's pointing to the 'User' model
          },
          {
            path: "subtasks",   // Populate the 'subtasks' field inside each task
            populate: {
              path: "assignedTo", // Optionally populate 'assignedTo' in subtasks as well
              model: "User",
            }
          }
        ]
      });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project); // Return the project as a JSON response
  } catch (error) {
    console.error("Error occurred while fetching project by ID:", error);
    res.status(500).json({ message: "Error fetching project by ID" });
  }
};




// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find(); // Retrieve all projects from the database
    res.status(200).json(projects); // Return the projects as a JSON response
  } catch (error) {
    console.error("Error occurred while fetching projects:", error);
    res.status(500).json({ message: "Error fetching projects" });
  }
};

// Get projects by creator ID
const getProjectsByCreatorId = async (req, res) => {
  const { creatorId } = req.params; // Get the creatorId from the request parameters

  try {
    const projects = await Project.find({ creator: creatorId })
      .populate("users")
      .populate("tasks"); // Find projects by creator ID and populate the users and tasks fields
    if (projects.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for this creator" });
    }
    res.status(200).json(projects); // Return the projects as a JSON response
  } catch (error) {
    console.error(
      "Error occurred while fetching projects by creator ID:",
      error
    );
    res.status(500).json({ message: "Error fetching projects by creator ID" });
  }
};

const getProjectsByUserId = async (req, res) => {
  const userId = req.user._id;

  try {
    // Find projects where the user is either assigned or is the creator, and populate users and tasks fields
    const projects = await Project.find({
      $or: [{ users: userId }, { creator: userId }], // Check both conditions
    })
      .populate("users")
      .populate({
        path: "tasks", // Populate tasks
        populate: [
          {
            path: "assignedTo", // Populate assignedTo within tasks
            select: "firstName lastName profilePicture",
          },
          {
            path: "subtasks", // Populate the entire subtasks
            populate: {
              path: "assignedTo", // Populate assignedTo within subtasks
              select: "firstName lastName profilePicture",
            },
          },
        ],
      });

    // Return the list of projects as JSON response
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error occurred while fetching projects by user ID:", error);
    res.status(500).json({ message: "Error fetching projects by user ID" });
  }
};


  

// Delete project by ID
const deleteProjectById = async (req, res) => {
  const { id } = req.params; // Get the project ID from the request parameters

  try {
    // Find the project by ID
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // If a profile picture exists, delete it from Cloudinary
    if (project.profilePicture) {
      const publicId = project.profilePicture.split("/").pop().split(".")[0]; // Extract the public ID from the URL
      await cloudinary.uploader.destroy(`projects/${publicId}`);
    }

    // Delete the project from the database
    await Project.findByIdAndDelete(id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error occurred while deleting project:", error);
    res.status(500).json({ message: "Error deleting project" });
  }
};

const editProject = async (req, res) => {
  const { id } = req.params; // Get the project ID from the request parameters
  const projectData = req.body; // Get the project data from the request body

  try {
    // Find the project by ID
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if a new profile image was uploaded
    if (req.files && req.files.profileImage) {
      const image = req.files.profileImage;

      // Upload the new image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(image.path, {
        folder: "projects",
        public_id: `${projectData.name}_profile_image`, // You can modify this if needed
      });

      // Delete the old image from Cloudinary if it exists
      if (project.profilePicture) {
        const publicId = project.profilePicture.split("/").pop().split(".")[0]; // Extract the public ID from the URL
        await cloudinary.uploader.destroy(`projects/${publicId}`);
      }

      // Add the new image URL to the project data
      projectData.profilePicture = uploadResult.secure_url;
    }

    // Update the project with the new data
    const updatedProject = await Project.findByIdAndUpdate(id, projectData, {
      new: true,
    });
    res.status(200).json(updatedProject); // Return the updated project
  } catch (error) {
    console.error("Error occurred while editing project:", error);
    res.status(500).json({ message: "Error editing project" });
  }
};

const assignUsersToProject = async (req, res) => {
  const { projectId } = req.params; // Get the project ID from the request parameters
  const { userIds } = req.body; // Get the user IDs to be added to the project

  try {
    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Add the user IDs to the project's users array if they are not already present
    userIds.forEach((userId) => {
      if (!project.users.includes(userId)) {
        project.users.push(userId);
      }
    });

    // Save the updated project
    await project.save();

    // Create notifications for each user assigned to the project
    for (let userId of userIds) {
      const user = await User.findById(userId);
      if (user) {
        // Create the notification message for the user
        const notificationMessage = `You have been assigned to the project: ${project.name}`;

        // Create the notification object
        const notification = {
          message: notificationMessage,
          type: 'info', // You can adjust the type as needed
          status: false, // Initially set to unread
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Push the notification to the user's notifications array
        user.notifications.push(notification);

        // Save the updated user document
        await user.save();
      }
    }

    res.status(200).json({ message: "Users successfully assigned to project", project });
  } catch (error) {
    console.error("Error occurred while assigning users to project:", error);
    res.status(500).json({ message: "Error assigning users to project" });
  }
};


// Remove a user from a project
const removeUserFromProject = async (req, res) => {
  const { projectId } = req.params; // Get the project ID from the request parameters
  const { userId } = req.body; // Get the user ID to be removed from the project

  try {
    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Remove the user from the project's users array
    project.users = project.users.filter((id) => id.toString() !== userId);

    // Save the updated project
    await project.save();

    // Create a notification for the user who is being removed from the project
    const user = await User.findById(userId);
    if (user) {
      const notificationMessage = `You have been removed from the project: ${project.name}`;

      // Create the notification object
      const notification = {
        message: notificationMessage,
        type: 'warning', // You can use 'info' or 'warning' depending on the context
        status: false, // Initially set to unread
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Push the notification to the user's notifications array
      user.notifications.push(notification);

      // Save the updated user document
      await user.save();
    }

    res.status(200).json({ message: "User successfully removed from project", project });
  } catch (error) {
    console.error("Error occurred while removing user from project:", error);
    res.status(500).json({ message: "Error removing user from project" });
  }
};


module.exports = {
  createProject,
  getAllProjects,
  getProjectsByCreatorId,
  deleteProjectById,
  editProject,
  getProjectById,
  getProjectsByUserId,
  removeUserFromProject,
  assignUsersToProject,

};
