import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import EditProjectModal from "./EditProjectModal";
import { getCurrentUserProfile } from "../../services/UserService";
import { getCompanyEmployees } from "../../services/CompanyService";
import { getRole } from "../../services/UserService";
import { toast } from "react-toastify";
const ProjectsCard = ({ project, fetchProjects }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [projectData, setProjectData] = useState(project);
  const [users, setUsers] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // State for current user
  const [taskStatePercentages, setTaskStatePercentages] = useState({
    todo: 0,
    inProgress: 0,
    needsReview: 0,
    completed: 0,
  });

  useEffect(() => {
    if (project.tasks && project.tasks.length > 0) {
      const percentages = getTaskStatePercentage(project.tasks);
      setTaskStatePercentages(percentages);
    }
  }, [project.tasks]);
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInTime = end - start;
    const diffInMonths = Math.ceil(diffInTime / (1000 * 60 * 60 * 24 * 30));
    return diffInMonths;
  };

  const calculateDaysLeft = (endDate) => {
    const currentDate = new Date();
    const end = new Date(endDate);
    const timeDiff = end - currentDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft >= 0 ? daysLeft : 0;
  };

  const daysLeft = calculateDaysLeft(project.endDate);

  const handleDeleteProject = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      await axios.delete(
        `http://localhost:5000/api/projects/delete/${project._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDeleteModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete the project. Please try again.");
    }
  };

  const handleMultiSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setProjectData({ ...projectData, users: selectedOptions });
  };

  const handleChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };
  const getTaskStatePercentage = (tasks) => {
    console.log("Tasks in project banner:", tasks ); // Debugging log
    const totalTasks = tasks.length;
    if (totalTasks === 0)
      return { todo: 0, inProgress: 0, needsReview: 0, completed: 0 };

    const taskStateCounts = tasks.reduce(
      (acc, task) => {
        if (task.status === "to do") acc.todo++;
        if (task.status === "in progress") acc.inProgress++;
        if (task.status === "needs review") acc.needsReview++;
        if (task.status === "completed") acc.completed++;
        return acc;
      },
      { todo: 0, inProgress: 0, needsReview: 0, completed: 0 }
    );

    return {
      todo: (taskStateCounts.todo / totalTasks) * 100,
      inProgress: (taskStateCounts.inProgress / totalTasks) * 100,
      needsReview: (taskStateCounts.needsReview / totalTasks) * 100,
      completed: (taskStateCounts.completed / totalTasks) * 100,
    };
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getCompanyEmployees();
        setUsers(response.employees);
        console.log("Fetched employees:", users); // Debugging log
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchUsers();
  }, []);
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const currentUserResponse = await getRole();
        setCurrentUser(currentUserResponse.role);
        console.log("Current user:", currentUser); // Debugging log
      } catch (error) {
        console.error("Failed to fetch role", error);
      }
    };

    fetchRole();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const updatedProject = {
      ...projectData,
      creator: userId,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/projects/edit/${project._id}`,
        updatedProject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Project updated successfully!");
      toast.success("Project updated successfully!"); // Success toast
      setError("");
      console.log("Response Data:", response.data);
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.message ||
            "An error occurred while updating the project."
        );
        toast.error("An error occurred while updating the project."); // Error toast for exceptions
      } else if (err.request) {
        setError("No response from the server. Please try again.");
        toast.error("Failed to update project. Please try again."); // Error toast
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setSuccess("");
      closeModal(); // Close modal after submit
    }
  };

  const closeModal = () => {
    setEditModalOpen(false); // Close the edit modal
  };

  const openModal = () => {
    setEditModalOpen(true); // Open the edit modal
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mt-5">
          <div className="lesson_name">
            <Link
              to={`/projecttasks/${project._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="project-block light-info-bg">
                <i className="icofont-paint"></i>
              </div>
            </Link>
            <span className="small text-muted project_name fw-bold">
              {project.name}
            </span>
            <h6 className="mb-0 fw-bold fs-6 mb-2">{project.category}</h6>
          </div>
          {currentUser === "Company" && (
            <div
              className="btn-group"
              role="group"
              aria-label="Basic outlined example"
            >
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  openModal();
                }}
              >
                <i className="icofont-edit text-success"></i>
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setDeleteModalOpen(true)} // Open the modal
              >
                <i className="icofont-ui-delete text-danger"></i>
              </button>
            </div>
          )}
        </div>

        <div className="avatar-list avatar-list-stacked pt-2">
          {project.users.map((user) => (
            <img
              key={user._id} // Ensure unique key for each user
              className="avatar rounded-circle sm"
              src={user.profilePicture || "path/to/default/avatar.jpg"} // Fallback to a default avatar if no profile picture
              alt={user.firstName} // Use user's name for alt text
            />
          ))}
          <span
            className="avatar rounded-circle text-center pointer sm"
            data-bs-toggle="modal"
            data-bs-target="#addUser"
          >
            <i className="icofont-ui-add"></i>
          </span>
        </div>
        <div className="row g-2 pt-4">
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className="icofont-sand-clock"></i>
              <span className="ms-2">
                {calculateDuration(project.startDate, project.endDate)} Month
              </span>{" "}
              {/* Duration */}
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className="icofont-group-students"></i>
              <span className="ms-2">{project.users.length} Members</span>{" "}
              {/* Number of users assigned */}
            </div>
          </div>
        </div>
        <div className="dividers-block"></div>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h4 className="small fw-bold mb-0">Progress</h4>
          <span className="small light-danger-bg p-1 rounded">
            <i className="icofont-ui-clock"></i> {daysLeft} Days Left
          </span>
        </div>
        <div className="progress" style={{ height: "8px" }}>
          <div
            className="progress-bar bg-secondary"
            role="progressbar"
            style={{ width: `${taskStatePercentages.todo}%` }}
            aria-valuenow={taskStatePercentages.todo}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
          <div
            className="progress-bar bg-warning ms-1"
            role="progressbar"
            style={{ width: `${taskStatePercentages.inProgress}%` }}
            aria-valuenow={taskStatePercentages.inProgress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
          <div
            className="progress-bar bg-info ms-1"
            role="progressbar"
            style={{ width: `${taskStatePercentages.needsReview}%` }}
            aria-valuenow={taskStatePercentages.needsReview}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
          <div
            className="progress-bar bg-success ms-1"
            role="progressbar"
            style={{ width: `${taskStatePercentages.completed}%` }}
            aria-valuenow={taskStatePercentages.completed}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditProjectModal
          projectData={projectData}
          setProjectData={setProjectData}
          handleChange={handleChange}
          handleMultiSelectChange={handleMultiSelectChange}
          handleSubmit={handleSubmit}
          users={users}
          closeModal={closeModal} // Pass modal close function
        />
      )}

      {/* Delete Project Modal */}
      {isDeleteModalOpen && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Delete Project?</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteModalOpen(false)} // Close the modal
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this project?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteModalOpen(false)} // Close the modal
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteProject} // Delete project
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsCard;
