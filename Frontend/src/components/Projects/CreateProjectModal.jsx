import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createProject } from "../../services/ProjectsService";
import { getCompanyEmployees } from "../../services/CompanyService";

const CreateProjectModal = ({ closeModal, error,fetchProjects  }) => {
  const [dateError, setDateError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]); // State to store selected users
  const [users, setUsers] = useState([]); // State to store fetched users
  const [projectData, setProjectData] = useState({
    name: "",
    category: "",
    priority: "0",
    startDate: "",
    endDate: "",
    description: "",
    users: [],
  });

  // Validate dates: startDate cannot be in the past, endDate cannot be before startDate
  const validateDates = () => {
    const today = new Date().toISOString().split("T")[0];
    if (projectData.startDate && projectData.startDate < today)
      return "Start date cannot be before today.";
    if (
      projectData.startDate &&
      projectData.endDate &&
      projectData.endDate < projectData.startDate
    )
      return "End date cannot be before start date.";
    return null;
  };

  // Fetch users when the modal is opened
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getCompanyEmployees(); // Fetch employees from the API
        console.log("Fetched employees in modal:", fetchedUsers); // Debugging log
        setUsers(fetchedUsers.employees);
      } catch (err) {
        toast.error("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  // Only validate dates when the form data is available
  useEffect(() => {
    const validationError = validateDates();
    setDateError(validationError);
  }, [projectData.startDate, projectData.endDate]);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateDates();
  
    if (validationError) {
      setDateError(validationError);
      return;
    }
  
    const projectWithUsers = { ...projectData, users: selectedUsers }; // Add selected users to the project data
  
    try {
      console.log("Creating project with data:", projectWithUsers); // Debugging log
      await createProject(projectWithUsers); // Create the project using the API
      fetchProjects(); // Refresh the project list after creation
      toast.success("Project created successfully!"); // Show success toast
      closeModal(); // Close the modal after successful submission
    } catch (err) {
      console.error("Error creating project:", err); // Debugging log
      toast.error("Failed to create project."); // Show error toast
    }
  };
  

  // Handle user selection (add or remove user)
  const handleUserSelection = (userId) => {
    setSelectedUsers((prevSelected) => {
      const newSelection = prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId) // Remove user if already selected
        : [...prevSelected, userId]; // Add user to the list
      return newSelection;
    });
  };

  return (
    <div className="modal" id="createProjectModal" style={{ display: "block" }}>
      <form onSubmit={onSubmit}>
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="createprojectLabel">
                Create Project
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Project Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Enter Project Name"
                  value={projectData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Project Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={projectData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Website Design">Website Design</option>
                  <option value="App Development">App Development</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Development">Development</option>
                  <option value="Backend Development">
                    Backend Development
                  </option>
                  <option value="Software Testing">Software Testing</option>
                  <option value="Marketing">Marketing</option>
                  <option value="SEO">SEO</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-sm">
                  <label htmlFor="priority" className="form-label">
                    Project Priority
                  </label>
                  <select
                    className="form-select"
                    name="priority"
                    value={projectData.priority}
                    onChange={handleChange}
                    required
                  >
                    <option value="0">Select Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col">
                  <label htmlFor="startDate" className="form-label">
                    Project Start Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="startDate"
                    name="startDate"
                    value={projectData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col">
                  <label htmlFor="endDate" className="form-label">
                    Project End Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="endDate"
                    name="endDate"
                    value={projectData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {dateError && (
                <div className="alert alert-danger">{dateError}</div>
              )}

              <div className="row g-3 mb-3">
                <div className="col-sm-12">
                  <label className="form-label">Assigned Users</label>
                  <div className="user-list">
                    {users && users.length > 0 ? (
                      users.map((user) => (
                        <div
                          key={user._id}
                          className={`user-item ${
                            selectedUsers.includes(user._id) ? "selected" : ""
                          }`}
                          onClick={() => handleUserSelection(user._id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            marginBottom: "6px",
                            cursor: "pointer",
                          }}
                        >
                          {/* Render a checkmark if the user is selected */}
                          {selectedUsers.includes(user._id) && (
                            <span
                              style={{
                                marginRight: "8px",
                                color: "#007bff", // Color of the checkmark
                                fontSize: "18px",
                              }}
                            >
                              ✔
                            </span>
                          )}

                          <img
                            src={user.profilePicture || "/default-avatar.png"}
                            alt={`${user.firstName} ${user.lastName}`}
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              marginRight: 8,
                            }}
                          />
                          <span>
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p>No users available</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description (optional)
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  placeholder="Add any extra details"
                  value={projectData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Project
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectModal;
