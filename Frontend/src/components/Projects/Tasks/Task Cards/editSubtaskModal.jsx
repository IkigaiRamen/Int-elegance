import React, { useState, useEffect } from "react";
import { fetchTaskById } from "../../../../services/TaskService"; // Assuming this function is available
import {
  createSubtask,
  updateSubtask,
  deleteSubtask,
} from "../../../../services/SubtaskService"; // Assuming this is the correct import path

const EditSubtaskModal = ({ onAddSubtask, onClose, taskId, subtask }) => {
  const [subtaskName, setSubtaskName] = useState("");
  const [subtaskStartDate, setSubtaskStartDate] = useState("");
  const [subtaskEndDate, setSubtaskEndDate] = useState("");
  const [subtaskPriority, setSubtaskPriority] = useState("medium");
  const [subtaskAssignedTo, setSubtaskAssignedTo] = useState([]); // Start with an empty list of assigned users
  const [error, setError] = useState("");
  const [taskDetails, setTaskDetails] = useState(null);

  useEffect(() => {
    console.log("Task ID:", taskId); // Debugging log
    const fetchTaskDetails = async () => {
      try {
        console.log("this is the fetch task details");
        const taskData = await fetchTaskById(taskId); // Fetch task details using task ID
        console.log("Fetched Task Data:", taskData.task); // Debugging log
        setTaskDetails(taskData.task); // Set the task details in state
        setSubtaskAssignedTo(taskData.task?.assignedTo || []); // Set the task's assigned users to the subtask
      } catch (err) {
        console.error("Error fetching task details:", err);
      }
    };

    if (taskId) {
      fetchTaskDetails();
    }

    // Reset subtask state when switching to a new subtask (editing mode)
    if (subtask) {
      setSubtaskName(subtask.name);
      setSubtaskStartDate(formatDate(subtask.startDate));
      setSubtaskEndDate(formatDate(subtask.endDate));
      setSubtaskPriority(subtask.priority);
      setSubtaskAssignedTo(subtask.assignedTo || []); // Set subtask assigned users
    }
  }, [taskId, subtask]);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
  };

  const handleAssignedToChange = (userId) => {
    const updatedAssignedTo = subtaskAssignedTo.includes(userId)
      ? subtaskAssignedTo.filter((id) => id !== userId) // Remove from assigned list
      : [...subtaskAssignedTo, userId]; // Add to assigned list

    setSubtaskAssignedTo(updatedAssignedTo);

    // Optional: Log the updated list for debugging purposes
    console.log("Updated Assigned To List:", updatedAssignedTo);
  };

  const handleSaveSubtask = async () => {
    // Validate subtask dates
    if (new Date(subtaskStartDate) < new Date(taskDetails?.startDate)) {
      setError(
        "Subtask start date cannot be before the parent task's start date."
      );
      return;
    }

    if (new Date(subtaskEndDate) > new Date(taskDetails?.endDate)) {
      setError("Subtask end date cannot be after the parent task's end date.");
      return;
    }

    // Prepare subtask data
    const subtaskData = {
      name: subtaskName,
      startDate: subtaskStartDate,
      endDate: subtaskEndDate,
      priority: subtaskPriority,
      assignedTo: subtaskAssignedTo, // The list of assigned users
      parentTaskId: taskId, // Parent task ID
    };

    setError(""); // Clear errors

    try {
      let response;
      if (subtask) {
        // If it's an edit, update the subtask
        response = await updateSubtask(subtask._id, subtaskData); // Call update API
      } else {
        // If it's create, create a new subtask
        response = await createSubtask(subtaskData); // Call create API
      }

      if (response.status === 200 || response.status === 201) {
        // If creation or update is successful, update the parent task
        onAddSubtask(response.data); // Pass the updated subtask to parent
        onClose(); // Close modal after adding/updating subtask
      } else {
        setError("Error saving subtask.");
      }
    } catch (err) {
      console.error("Error while saving subtask:", err);
      setError("Error saving subtask.");
    }
  };

  const handleDeleteSubtask = async () => {
    if (window.confirm("Are you sure you want to delete this subtask?")) {
      try {
        await deleteSubtask(subtask._id); // Call the delete API with the subtask ID
        onClose(); // Close the modal
        onAddSubtask(); // Optionally, you can refresh the parent task's subtask list here
      } catch (err) {
        console.error("Error deleting subtask:", err);
        setError("Error deleting subtask.");
      }
    }
  };

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {subtask ? "Edit Subtask" : "Add Subtask"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3 text-center">
              <label className="form-label">Subtask Name</label>
              <input
                type="text"
                className="form-control"
                value={subtaskName}
                onChange={(e) => setSubtaskName(e.target.value)}
                required
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={subtaskStartDate}
                  onChange={(e) => setSubtaskStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={subtaskEndDate}
                  onChange={(e) => setSubtaskEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Assigned To Section */}
            <div className="mb-3 text-center">
              <label className="form-label">Assigned To</label>
              <div className="custom-dropdown">
                {taskDetails?.assignedTo &&
                taskDetails?.assignedTo.length > 0 ? (
                  <div className="user-list">
                    {taskDetails?.assignedTo.map((user) => (
                      <div
                        key={user._id}
                        className={`user-item ${
                          subtaskAssignedTo.includes(user._id) ? "selected" : ""
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
                        {subtaskAssignedTo.includes(user._id) && (
                          <span className="checkmark">✔️</span> // Added checkmark
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No users available</p>
                )}
              </div>
            </div>

            <div className="mb-3 text-center">
              <label className="form-label">Priority</label>
              <select
                className="form-control"
                value={subtaskPriority}
                onChange={(e) => setSubtaskPriority(e.target.value)}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Close
            </button>
            {subtask && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteSubtask}
              >
                Delete
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveSubtask}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSubtaskModal;
