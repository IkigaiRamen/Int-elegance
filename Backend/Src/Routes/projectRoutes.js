const express = require("express");
const {
  createProject,
  getAllProjects,
  getProjectsByCreatorId,
  deleteProjectById,
  editProject,
  getProjectById,
  getProjectsByUserId,
  assignUsersToProject,
  removeUserFromProject,
} = require("../Controllers/projectController"); // Use destructuring to import
const { authenticateToken } = require("../Middleware/authMiddleware"); // Import the protect middleware

const router = express.Router();
router.get("/user", authenticateToken, getProjectsByUserId);
// POST route to create a new project
router.post("/create", authenticateToken, createProject);

// Get all projects
router.get("/", authenticateToken, getAllProjects);


// Get projects by creator ID
router.get("/creator/:creatorId", authenticateToken, getProjectsByCreatorId);

// Get project by ID
router.get("/:id", authenticateToken, getProjectById);

// Delete a project by ID
router.delete("/delete/:id", authenticateToken, deleteProjectById);

// Edit a project by ID
router.put("/edit/:id", authenticateToken, editProject);

// Assign users to a project
router.put("/:projectId/assign-users", authenticateToken, assignUsersToProject);

// Remove a user from a project
router.put("/:projectId/remove-user", authenticateToken, removeUserFromProject);

module.exports = router;
