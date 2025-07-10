import React, { useState, useEffect } from "react";
import { fetchTaskById } from "../../../../services/TaskService"; // Assuming this function is available
import { createSubtask, updateSubtask } from "../../../../services/SubtaskService"; // Assuming this is the correct import path

const SubtaskModal = ({ onAddSubtask, onClose, taskId, subtaskId }) => {
  const [subtaskName, setSubtaskName] = useState("");
  const [subtaskStartDate, setSubtaskStartDate] = useState("");
  const [subtaskEndDate, setSubtaskEndDate] = useState("");
  const [subtaskPriority, setSubtaskPriority] = useState("medium");
  const [subtaskAssignedTo, setSubtaskAssignedTo] = useState([]);
  const [subtaskPredecessors, setSubtaskPredecessors] = useState([]);
  const [error, setError] = useState("");
  const [taskDetails, setTaskDetails] = useState(null);
  const [subtaskDetails, setSubtaskDetails] = useState(null);

  useEffect(() => {
    // Fetch task details for the parent task
    const fetchTaskDetails = async () => {
      try {
        const taskData = await fetchTaskById(taskId); // Fetch task details using task ID
        setTaskDetails(taskData.task); // Set the task details in state
      } catch (err) {
        console.error("Error fetching task details:", err);
      }
    };

    if (taskId) {
      fetchTaskDetails();
    }

    // If editing a subtask, fetch its details
    const fetchSubtaskDetails = async () => {
      if (subtaskId) {
        try {
          const response = await fetch(`/api/subtasks/${subtaskId}`); // Adjust API endpoint if necessary
          const subtaskData = await response.json();
          setSubtaskDetails(subtaskData);
          setSubtaskName(subtaskData.name);
          setSubtaskStartDate(subtaskData.startDate);
          setSubtaskEndDate(subtaskData.endDate);
          setSubtaskPriority(subtaskData.priority);
          setSubtaskAssignedTo(subtaskData.assignedTo);
          setSubtaskPredecessors(subtaskData.dependencies);
        } catch (err) {
          console.error("Error fetching subtask details:", err);
        }
      }
    };

    if (subtaskId) {
      fetchSubtaskDetails();
    }
  }, [taskId, subtaskId]);

  const calculateDuration = (start, end) => {
    const timeDiff = new Date(end) - new Date(start);
    return Math.floor(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
  };

  const handleAssignedToChange = (userId) => {
    if (subtaskAssignedTo.includes(userId)) {
      setSubtaskAssignedTo(subtaskAssignedTo.filter((id) => id !== userId)); // Remove from assigned list
    } else {
      setSubtaskAssignedTo([...subtaskAssignedTo, userId]); // Add to assigned list
    }
  };

  const handlePredecessorChange = (subtaskId) => {
    if (subtaskPredecessors.includes(subtaskId)) {
      setSubtaskPredecessors(subtaskPredecessors.filter((id) => id !== subtaskId)); // Remove from predecessors list
    } else {
      setSubtaskPredecessors([...subtaskPredecessors, subtaskId]); // Add to predecessors list
    }
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

    // Validate predecessors
    for (let predecessorId of subtaskPredecessors) {
      const predecessor = taskDetails?.subtasks?.find(
        (subtask) => subtask.id === predecessorId
      );
      if (
        predecessor &&
        new Date(subtaskStartDate) < new Date(predecessor.endDate)
      ) {
        setError(
          "Subtask start date cannot be before the predecessor's end date."
        );
        return;
      }
    }

    // Calculate the duration and prepare subtask data
    const duration = calculateDuration(subtaskStartDate, subtaskEndDate);

    const subtaskData = {
      name: subtaskName,
      startDate: subtaskStartDate,
      endDate: subtaskEndDate,
      priority: subtaskPriority,
      assignedTo: subtaskAssignedTo,
      dependencies: subtaskPredecessors,
      parentTaskId: taskId, // Parent task ID
      duration,
    };

    setError(""); // Clear errors

    try {
      let response;
      if (subtaskId) {
        // If it's an edit, update the subtask
        response = await updateSubtask(subtaskId, subtaskData); // Call update API
      } else {
        // If it's create, create a new subtask
        response = await createSubtask(subtaskData); // Call create API
      }

      if (response.status === 200 || response.status === 201) {
        // If creation or update is successful, update the parent task
        onAddSubtask(response.data); // Update the parent task with the new subtask
        onClose(); // Close modal after adding/updating subtask
      } else {
        setError("Error saving subtask.");
      }
    } catch (err) {
      console.error("Error while saving subtask:", err);
      setError("Error saving subtask.");
    }
  };

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {subtaskId ? "Edit Subtask" : "Add Subtask"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No users available</p>
                )}
              </div>
            </div>

            {/* Predecessors Section */}
            <div className="mb-3 text-center">
              <label className="form-label">Predecessors</label>
              <div className="custom-dropdown">
                {taskDetails?.subtasks &&
                taskDetails?.subtasks.length > 0 ? (
                  <div className="subtask-list">
                    {taskDetails?.subtasks.map((subtask) => (
                      <div
                        key={subtask._id}
                        className={`subtask-item ${
                          subtaskPredecessors.includes(subtask._id) ? "selected" : ""
                        }`}
                        onClick={() => handlePredecessorChange(subtask._id)}
                      >
                        <span className="subtask-name">{subtask.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No subtasks available</p>
                )}
              </div>
            </div>

            {/* Priority Section */}
            <div className="mb-3 text-center">
              <label className="form-label">Priority</label>
              <select
                className="form-control"
                value={subtaskPriority}
                onChange={(e) => setSubtaskPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSaveSubtask}>
              {subtaskId ? "Update Subtask" : "Add Subtask"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtaskModal;
