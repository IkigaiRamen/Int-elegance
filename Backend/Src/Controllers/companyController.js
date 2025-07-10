const Company = require("../Models/Company");
const User = require("../Models/User");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Task = require("../Models/Task"); // Import Task model
const Subtask = require("../Models/Subtask"); // Import Subtask model
const Project = require("../Models/Project"); // Import Project model

require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: "drexcmawh",
  api_key: "749992466314972",
  api_secret: "p0Bz1rVzCyVtVWX9ZafYpyl5UgY", // Replace with your actual API secret
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.PASSWORD, // Your email password
  },
});

// Create a new company
const createCompany = async (req, res) => {
  const { name, address, website, email, phoneNumber, description } = req.body;
  console.log("Incohming request body:", req.body);
  console.error("Incoming request body:", req.body);

  const userId = req.user._id;

  try {
    // Create a new company instance without the logo field
    const newCompany = new Company({
      name,
      address,
      website,
      email,
      phoneNumber,
      description,
      creator: userId, // Set creator to the extracted userId
    });

    // Save the company in the database
    await newCompany.save();

    return res
      .status(201)
      .json({ message: "Company created successfully", company: newCompany });
  } catch (error) {
    console.error("Error creating company:", error);
    return res
      .status(500)
      .json({ message: "Failed to create company", error: error.message });
  }
};

const updateCompanyLogo = async (req, res) => {
  const { logo, companyId } = req.body; // Get logo and companyId from the request body
  const userId = req.user._id; // Get the authenticated user's ID (creatorId)

  console.log(`Received request to update logo for companyId: ${companyId} by userId: ${userId}`);

  if (!logo) {
    console.warn(`No logo provided for userId: ${userId}`);
    return res.status(400).json({ message: "No logo provided" });
  }

  try {
    // Find the company where the companyId matches
    const company = await Company.findById(companyId);

    if (!company) {
      console.warn(`Company not found for companyId: ${companyId}`);
      return res.status(404).json({ message: "Company not found" });
    }

    console.log(`Uploading logo to Cloudinary for companyId: ${companyId}`);

    // Upload the logo to Cloudinary using base64 data
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${logo}`,
      {
        folder: "company_logos",
        transformation: [{ width: 300, height: 300, crop: "fit" }],
      }
    );

    console.log(`Logo uploaded to Cloudinary for companyId: ${companyId}. Secure URL: ${result.secure_url}`);

    // Update the company logo URL in the database
    company.logo = result.secure_url;
    await company.save();

    console.log(`Company logo updated successfully for companyId: ${companyId}`);
    res.status(200).json(company);
  } catch (error) {
    console.error(`Error during logo update for companyId: ${companyId}`, error);
    res.status(500).json({ message: "Server error" });
  }
};



// Get all companies
const getCompanies = async (req, res) => {
  try {
    // Fetch all companies
    const companies = await Company.find()
      .populate("creator")
      .populate("employees")
      .populate("projects");

    return res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch companies", error: error.message });
  }
};

// Get a company by ID
const getCompanyById = async (req, res) => {
  const { companyId } = req.params;

  try {
    // Fetch the company by ID
    const company = await Company.findById(companyId)
      .populate("creator")
      .populate("employees")
      .populate("projects");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).json(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch company", error: error.message });
  }
};

// Update a company by ID
const updateCompany = async (req, res) => {
  const { companyId } = req.params;
  const { name, address, website, industry, description } = req.body;
  const logoFile = req.file; // Assuming you're sending the file as 'file'

  try {
    let updatedFields = { name, address, website, industry, description };

    // If a new logo file is provided, upload it to Cloudinary
    if (logoFile) {
      const result = await cloudinary.uploader.upload(logoFile.path, {
        folder: "company_logos", // Optional folder in Cloudinary
      });
      updatedFields.logo = result.secure_url; // Update the logo with the Cloudinary URL
    }

    // Find the company and update the fields
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).json({
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return res
      .status(500)
      .json({ message: "Failed to update company", error: error.message });
  }
};

// Get companies by creator ID
const getCompaniesByCreatorId = async (req, res) => {
  // Extract userId from the decoded token
  const userId = req.user._id; // Use req.user to get the userId

  try {
    // Fetch the first company created by the specified creator ID
    const company = await Company.findOne({ creator: userId })
      .populate("creator")
      .populate("employees")
      .populate("projects");

    if (!company) {
      return res
        .status(404)
        .json({ message: "No company found for the specified creator ID" });
    }

    return res.status(200).json(company);
  } catch (error) {
    console.error("Error fetching company by creator ID:", error);
    return res.status(500).json({
      message: "Failed to fetch company by creator ID",
      error: error.message,
    });
  }
};

// Delete a company by ID
const deleteCompany = async (req, res) => {
  const { companyId } = req.params;

  try {
    const deletedCompany = await Company.findByIdAndDelete(companyId);

    if (!deletedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete company", error: error.message });
  }
};

const sendInviteEmail = async (userEmail, companyName) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: `Invitation to Join ${companyName}`,
    text: `Hello,\n\nYou have been invited to join the company "${companyName}".\n\nBest Regards,\nCompany Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending invite email:", error);
    throw new Error("Failed to send invite email");
  }
};

// Assign user to company and send invite email
const assignUserToCompany = async (req, res) => {
  const { email } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const company = await Company.findOne({ creator: userId });
    if (!company) return res.status(404).json({ message: "Company not found" });

    // Add invitation to user's invitations array
    user.invitations.push({
      companyId: company._id,
      companyName: company.name,
    });
    sendInviteEmail(user.email, company.name);
    await user.save();

    return res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to send invitation", error: error.message });
  }
};

// Get all employees of a company by ID

const getCompanyEmployees = async (req, res) => {
  try {
    // Extract userId from the decoded token
    const userId = req.user._id;
  
    // Check if userId exists
    if (!userId) {
      console.error("User ID is missing in request");
      return res.status(400).json({ message: "User ID is missing" });
    }
  
    // Find the company where the user is either the creator or in the employees list
    const company = await Company.findOne({
      $or: [
        { creator: userId }, // Check if the user is the creator
        { employees: userId }, // Check if the user is in the employees list
      ],
    }).populate({
      path: "employees", // Ensure employees is an array of ObjectIds referring to the User model
    });
  
    // Log company data for debugging
    console.log("Company data:", company);
  
    // Handle case where no company is found
    if (!company) {
      return res
        .status(404)
        .json({ message: "No company found for this user" });
    }
  
    // Return the employees associated with the company
    return res.status(200).json({ employees: company.employees });
  } catch (error) {
    // Enhanced error logging for debugging
    console.error("Error occurred in getCompanyEmployees:", error);
  
    return res.status(500).json({
      message: "Failed to fetch company employees",
      error: error.message,
    });
  }
};  

const removeUserFromCompany = async (req, res) => {
  const { employeeId } = req.body; // Employee ID of the user to be removed
  const userId = req.user._id; // Creator's ID

  try {
    // Find the user by employeeId
    const user = await User.findById(employeeId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the company created by the current user
    const company = await Company.findOne({ creator: userId });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Remove the user from the company's employees array
    const updatedCompany = await Company.findByIdAndUpdate(
      company._id,
      { $pull: { employees: user._id } }, // `$pull` removes the user ID from the array
      { new: true }
    );

    // Find all projects associated with the company creator
    const projects = await Project.find({ creator: userId });

    for (const project of projects) {
      // Remove the user from project users
      await Project.findByIdAndUpdate(
        project._id,
        { $pull: { users: user._id } }, // Assuming the project schema has a `users` array
        { new: true }
      );

      // Remove the user from project tasks
      await Task.updateMany(
        { project: project._id },
        { $pull: { assignedTo: user._id } }
      );

      // Remove the user from subtasks under the project's tasks
      await SubTask.updateMany(
        { task: { $in: project.tasks } }, // Assuming `project.tasks` is an array of task IDs
        { $pull: { assignedTo: user._id } }
      );
    }

    return res.status(200).json({
      message: "User removed from company, tasks, and subtasks successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error removing user from company:", error);
    return res.status(500).json({
      message: "Failed to remove user from company",
      error: error.message,
    });
  }
};

const getTotalEmployees = async (req, res) => {
  try {
    const company = await Company.findOne({ creator: req.user._id }).populate('employees');
    
    if (!company) {
      console.log('No company found for the logged-in user');
      return res.status(404).json({ message: 'No company found' });
    }

    return res.json({ totalEmployees: company.employees.length });
  } catch (err) {
    console.error('Error fetching total employees:', err);
    return res.status(500).json({ error: 'Error fetching total employees' });
  }
};

const getProjectsStatusStats = async (req, res) => {
  try {
    const company = await Company.findOne({ creator: req.user._id }).populate('projects');
    
    if (!company) {
      console.log('No company found for the logged-in user');
      return res.status(404).json({
        'in progress': 0,
        'completed': 0,
        'waiting for approval': 0,
        'cancelled': 0,
      });
    }

    const statusStats = {
      'in progress': 0,
      'completed': 0,
      'waiting for approval': 0,
      'cancelled': 0,
    };

    company.projects.forEach(project => {
      if (statusStats.hasOwnProperty(project.status)) {
        statusStats[project.status]++;
      }
    });

    return res.json(statusStats);
  } catch (err) {
    console.error('Error fetching project status stats:', err);
    return res.status(500).json({ error: 'Error fetching project status stats' });
  }
};

const getTaskCompletionRate = async (req, res) => {
  try {
    const company = await Company.findOne({ creator: req.user._id }).populate('projects');
    
    if (!company) {
      console.log('No company found for the logged-in user');
      return res.status(404).json({ completionRate: 0 });
    }

    let totalTasks = 0;
    let completedTasks = 0;

    for (const project of company.projects) {
      const populatedProject = await Project.findById(project._id).populate('tasks');
      const tasks = populatedProject.tasks;

      // Ensure tasks is an array before proceeding
      if (Array.isArray(tasks)) {
        totalTasks += tasks.length;
        completedTasks += tasks.filter(task => task.status === 'completed').length;
      } else {
        console.warn(`Tasks for project ${project._id} are not an array:`, tasks);
      }
    }

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return res.json({ completionRate });
  } catch (err) {
    console.error('Error fetching task completion rate:', err);
    return res.status(500).json({ error: 'Error fetching task completion rate' });
  }
};

const getActiveProjectsAndTasks = async (req, res) => {
  try {
    const company = await Company.findOne({ creator: req.user._id }).populate('projects');
    
    if (!company) {
      console.log('No company found for the logged-in user');
      return res.status(404).json({ activeProjects: 0, activeTasks: 0 });
    }

    const activeProjects = company.projects.filter(project => 
      project.status === 'in progress' && project.tasks.length > 0
    );

    const activeTasks = activeProjects.reduce((acc, project) => {
      const inProgressTasks = project.tasks.filter(task => task.status === 'in progress').length;
      return acc + inProgressTasks;
    }, 5);

    return res.json({ activeProjects: activeProjects.length, activeTasks });
  } catch (err) {
    console.error('Error fetching active projects and tasks:', err);
    return res.status(500).json({ error: 'Error fetching active projects and tasks' });
  }
};

const getProjectCompletionByPriority = async (req, res) => {
  try {
    // Find projects where the creator is the logged-in user
    const projects = await Project.find({ creator: req.user._id });

    if (!projects || projects.length === 0) {
      console.log('No projects found for the logged-in user');
      return res.status(404).json({ low: 0, medium: 0, high: 0 });
    }

    const priorityStats = {
      low: 0,
      medium: 0,
      high: 0,
    };

    // Iterate through the projects and count completed projects by priority
    projects.forEach(project => {
      if (project.status === 'completed') {
        priorityStats[project.priority]++;
      }
    });

    return res.json(priorityStats);
  } catch (err) {
    console.error('Error fetching project completion by priority:', err);
    return res.status(500).json({ error: 'Error fetching project completion by priority' });
  }
};


const getUpcomingProjectDeadlines = async (req, res) => {
  try {
    const company = await Company.findOne({ creator: req.user._id }).populate('projects');
    
    if (!company) {
      console.log('No company found for the logged-in user');
      return res.status(404).json([]);
    }

    const upcomingDeadlines = company.projects
      .filter(project => project.endDate > new Date() && project.status !== 'completed')
      .map(project => ({
        name: project.name,
        endDate: project.endDate,
      }));

    return res.json(upcomingDeadlines);
  } catch (err) {
    console.error('Error fetching upcoming project deadlines:', err);
    return res.status(500).json({ error: 'Error fetching upcoming project deadlines' });
  }
};

const getEmployeeProjectDistribution = async (req, res) => {
  try {
    const company = await Company.findOne({ creator: req.user._id }).populate('projects employees');
    
    if (!company) {
      console.log('No company found for the logged-in user');
      return res.status(404).json([]);
    }

    const distribution = company.projects.map(project => ({
      projectName: project.name,
      employeeCount: project.users.length,
    }));

    return res.json(distribution);
  } catch (err) {
    console.error('Error fetching employee project distribution:', err);
    return res.status(500).json({ error: 'Error fetching employee project distribution' });
  }
};




module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  getCompaniesByCreatorId,
  deleteCompany,
  updateCompanyLogo,
  assignUserToCompany,
  getCompanyEmployees,
  removeUserFromCompany,
  getTotalEmployees,
  getProjectsStatusStats,
  getTaskCompletionRate,
  getActiveProjectsAndTasks,
  getProjectCompletionByPriority,
  getUpcomingProjectDeadlines,
  getEmployeeProjectDistribution,
};
