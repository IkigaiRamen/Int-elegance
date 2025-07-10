import React, { useState, useEffect } from "react";
import "./subtask.css";
import { getCurrentUserProfile } from "../../../../services/UserService";
import { getProjectById } from "../../../../services/ProjectsService"; // You will use this service to fetch project details
import { updateSubtask } from "../../../../services/SubtaskService";
import { toast } from "react-toastify";
const SubtaskCard = ({ subtask, onEdit, task, projectId }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [projectCreatorId, setProjectCreatorId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const [status, setStatus] = useState(subtask.status); // State for the subtask's status
  useEffect(() => {
    // Fetch current user profile and set the user ID
    const fetchCurrentUserProfile = async () => {
      const userProfile = await getCurrentUserProfile();
      setCurrentUserId(userProfile._id);
    };

    // Fetch project creator based on projectId
    const fetchProjectCreator = async () => {
      const projectData = await getProjectById(projectId); // Fetch project data using the projectId
      setProjectCreatorId(projectData.creatorId); // Assuming 'creatorId' field contains the project creator's ID
    };

    fetchCurrentUserProfile();
    fetchProjectCreator();
  }, [projectId]); // Re-fetch if projectId changes

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "short" };
    return new Date(date)
      .toLocaleDateString("en-GB", options)
      .replace(",", "")
      .toLowerCase();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "to do":
        return "badge bg-primary";
      case "in progress":
        return "badge bg-warning";
      case "needs review":
        return "badge bg-info";
      case "completed":
        return "badge bg-success";
      default:
        return "badge bg-secondary";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "high":
        return "badge bg-danger";
      case "medium":
        return "badge bg-warning";
      case "low":
        return "badge bg-success";
      default:
        return "badge bg-secondary";
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [editedSubtask, setEditedSubtask] = useState({ ...subtask });

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => {
    setEditedSubtask({ ...subtask }); // Set initial values to the modal
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true); // Start loading
    setError(null); // Clear previous errors

    try {
      // Save the updated subtask via API
      await updateSubtask(editedSubtask._id, editedSubtask);

      // Notify parent component of the update
      onEdit(editedSubtask); // Pass the updated subtask to parent component
      closeModal(); // Close modal after saving
    } catch (err) {
      setError("Error updating subtask");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  const handleStatusChange = async (e, newStatus) => {
    e.stopPropagation(); // Prevent triggering unwanted events
    console.log("Attempting to change status to:", newStatus);
    try {
      const updatedSubtask = { ...subtask, status: newStatus };
      const response = await updateSubtask(updatedSubtask._id, updatedSubtask);
      toast.success("Subtask status updated successfully");
      setStatus(newStatus); // Update local state
      onEdit(response || updatedSubtask); // Notify parent of the change
      setStatusDropdownOpen(false); // Close the dropdown after successful update
    } catch (err) {
      console.error("Error updating subtask:", err);
      setError("An error occurred while updating the subtask status.");
    }
  };

  const handleFieldChange = (field, value) => {
    setEditedSubtask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleStatusDropdown = (e) => {
    e.stopPropagation();
    if (!subtask.assignedTo.includes(currentUserId)) {
      setStatusDropdownOpen(!statusDropdownOpen);
    }
  };
  const handleAssignedToChange = (userId) => {
    subtask((prevSubtask) => {
      const isAlreadyAssigned = prevSubtask.assignedTo.includes(userId);

      return {
        ...prevSubtask,
        assignedTo: isAlreadyAssigned
          ? prevSubtask.assignedTo.filter((id) => id !== userId) // Remove user
          : [...prevSubtask.assignedTo, userId], // Add user
      };
    });
  };
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        statusDropdownOpen &&
        !e.target.closest(".status-dropdown") &&
        !e.target.closest(".badge")
      ) {
        setStatusDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [statusDropdownOpen]);

  return (
    <li
      className="dd-item subtask-card"
      data-id={subtask._id}
      style={{ marginLeft: "20px" }}
    >
      <div className="dd-handle">
        <div className="task-info d-flex align-items-center justify-content-between">
          <h6 className="py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0 light-info-bg">
            {subtask.name}
          </h6>
          <div className="task-priority d-flex flex-column align-items-center justify-content-center">
            <span
              className={getStatusBadgeClass(status)}
              onClick={toggleStatusDropdown}
              style={{ cursor: "pointer" }}
            >
              {status.toUpperCase()}
            </span>
            {(currentUserId !== projectCreatorId ||
              subtask.assignedTo.some((user) => user._id === currentUserId)) &&
              statusDropdownOpen && (
                <div className="status-dropdown">
                  <div className="dropdown-options">
                    {["to do", "in progress", "needs review", "completed"].map(
                      (status) => (
                        <span
                          key={`${status}-${subtask.id}`} // Ensure uniqueness
                          onClick={(e) => handleStatusChange(e, status)}
                          className={`status-option ${getStatusBadgeClass(
                            status
                          )}`}
                          style={{
                            cursor: "pointer",
                            display: "block",
                            padding: "8px",
                            borderRadius: "5px",
                          }}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            <span
              className={`badge priority-badge mt-2 ${getPriorityBadgeClass(
                subtask.priority
              )}`}
            >
              {subtask.priority.toUpperCase()}
            </span>
            <div className="avatar-list avatar-list-stacked mt-2">
              {subtask.assignedTo.map((user, index) => (
                <img
                  key={index}
                  className="avatar rounded-circle small-avt"
                  src={
                    user.profilePicture || "assets/images/default-avatar.jpg"
                  }
                  alt={user.firstName}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="tikit-info row g-3 align-items-center">
          <div className="col-sm">
            <ul className="d-flex list-unstyled align-items-center flex-wrap">
              <li className="me-2">
                <div className="d-flex align-items-center">
                  <i className="icofont-calendar"></i>
                  <span className="ms-1">{formatDate(subtask.startDate)}</span>
                </div>
              </li>
              <li>
                <div className="d-flex align-items-center">
                  <i className="icofont-calendar"></i>
                  <span className="ms-1">{formatDate(subtask.endDate)}</span>
                </div>
              </li>
              <li>
                <div className="d-flex align-items-center">
                  <i className="icofont-clock-time"></i>
                  <span className="ms-1">{subtask.duration} days</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Show Edit button only if current user is assigned to the subtask or is the project creator */}
      {!currentUserId === projectCreatorId && (
        <div className="position-relative">
          <button
            className="btn btn-sm btn-warning position-absolute bottom-0 end-0 mb-2 me-2"
            onClick={openModal}
          >
            <i className="icofont-pencil-alt-2"></i>
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Edit Subtask</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="subtaskName" className="form-label">
                    Subtask Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="subtaskName"
                    name="subtaskName"
                    value={editedSubtask.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="subtaskPriority" className="form-label">
                    Priority
                  </label>
                  <select
                    id="subtaskPriority"
                    name="subtaskPriority"
                    className="form-select"
                    value={editedSubtask.priority}
                    onChange={(e) =>
                      handleFieldChange("priority", e.target.value)
                    }
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="subtaskStatus" className="form-label">
                    Status
                  </label>
                  <select
                    id="subtaskStatus"
                    name="subtaskStatus"
                    className="form-select"
                    value={editedSubtask.status}
                    onChange={(e) =>
                      handleFieldChange("status", e.target.value)
                    }
                  >
                    <option value="to do">To Do</option>
                    <option value="in progress">In Progress</option>
                    <option value="needs review">Needs Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col">
                    <label className="form-label">Subtask Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={
                        editedSubtask.startDate
                          ? editedSubtask.startDate.split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleFieldChange("startDate", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col">
                    <label className="form-label">Subtask End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={
                        editedSubtask.endDate
                          ? editedSubtask.endDate.split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleFieldChange("endDate", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* Assigned To Section */}
                {/* Assigned To Section */}
                <div className="mb-3 text-center">
                  <label className="form-label">Assigned To</label>

                  {/* Combined user list: already assigned and available users */}
                  <div className="custom-dropdown">
                    {task.assignedTo && task.assignedTo.length > 0 ? (
                      <div className="user-list">
                        {task.assignedTo.map((user) => (
                          <div
                            key={user._id}
                            className={`user-item ${
                              subtask.assignedTo.includes(user._id)
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => handleAssignedToChange(user._id)}
                          >
                            <img
                              src={user.profilePicture || "/default-avatar.png"}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="avatar lg rounded-circle img-thumbnail"
                            />
                            <span className="user-name">
                              {user.firstName} {user.lastName}
                            </span>
                            {/* Show check mark for users already assigned */}
                            {subtask.assignedTo.includes(user._id) && (
                              <i className="check-icon">✔</i>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-users">No users available</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                {error && <div className="text-danger mt-2">{error}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default SubtaskCard;
