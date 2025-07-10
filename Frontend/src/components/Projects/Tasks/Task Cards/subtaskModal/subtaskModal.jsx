import React, { useState, useEffect } from "react";
import { fetchTaskById } from "../../../../../services/TaskService";
import AssignedSubtaskUserList from "./assignedSubTaskUserList";
import { createSubtask } from "../../../../../services/SubtaskService";
import { updateSubtask } from "../../../../../services/SubtaskService";
import { format, differenceInDays } from "date-fns"; // Added differenceInDays for duration calculation

const SubtaskModal = ({ subtask, taskId, onSave, onClose }) => {
  const [subtaskId, setSubtaskId] = useState("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("low");
  const [taskAssignedUsers, setTaskAssignedUsers] = useState([]);
  const [subtaskAssignedUsers, setSubtaskAssignedUsers] = useState([]);
  const [parentTaskId, setParentTaskId] = useState(taskId);
  const [predecessor, setPredecessor] = useState(null); // Single predecessor state
  const [relation, setRelation] = useState(""); // Single relation type for the predecessor
  const [otherSubtasks, setOtherSubtasks] = useState([]); // List of other subtasks
  const [duration, setDuration] = useState(null); // Duration for subtask

  // Fetch task data to get assigned users and subtasks
  useEffect(() => {
    const fetchTaskUsers = async () => {
      try {
        const task = await fetchTaskById(taskId);
        setTaskAssignedUsers(task.task.assignedTo || []);
        setOtherSubtasks(task.task.subtasks || []); // Get other subtasks
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

    if (taskId) {
      fetchTaskUsers();
    }
  }, [taskId]);

  // Set initial subtask values and calculate duration
  useEffect(() => {
    if (subtask) {
      setSubtaskId(subtask._id);
      setName(subtask.name || "");
      setStartDate(subtask.startDate ? format(new Date(subtask.startDate), "yyyy-MM-dd") : "");
      setEndDate(subtask.endDate ? format(new Date(subtask.endDate), "yyyy-MM-dd") : "");
      setPriority(subtask.priority || "low");
      setSubtaskAssignedUsers(subtask.assignedTo || []);
      setPredecessor(subtask.predecessor || null);
      setRelation(subtask.relation || "FS");
      setDuration(subtask.duration || null);
      } else {
      setName("");
      setStartDate("");
      setEndDate("");
      setPriority("low");
      setSubtaskAssignedUsers([]);
      setParentTaskId(taskId);
      setPredecessor(null);
      setRelation("FS");
      setDuration(null);
    }
  }, [subtask, taskId]);
  

// Duration calculation
const calculateDuration = (start, end) => {
  if (start && end) {
    const startDate = new Date(start); // Convert start to a Date object if it's a string
    const endDate = new Date(end); // Convert end to a Date object if it's a string

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    const duration = differenceInDays(endDate, startDate); // Calculate the difference in days
    console.log("Duration:", duration);

    return duration; // Return the calculated duration in days
  }
  return null; // Return null if either start or end is missing
};


  const handleRelationChange = (newRelation) => {
    setRelation(newRelation);
  };

  const handleSave = async () => {
    // Calculate duration
    const calculatedDuration = calculateDuration(startDate, endDate);
  
    // Combine predecessor ID and relation into the required string format
    const predecessorString = predecessor + relation;
  
    const subtaskData = {
      name,
      startDate,
      endDate,
      priority,
      assignedTo: subtaskAssignedUsers,
      parentTaskId,
      predecessor: predecessorString, // Send the formatted predecessor
      duration: calculatedDuration, // Send the calculated duration
    };
  
    try {
      if (subtask) {
        const updatedSubtask = await updateSubtask(subtask._id, subtaskData);
        onSave(updatedSubtask);
      } else {
        const newSubtask = await createSubtask(subtaskData);
        onSave(newSubtask);
      }
    } catch (error) {
      console.error("Error saving subtask:", error);
    }
  };
  

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {subtask ? "Edit Subtask" : "Add Subtask"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Subtask Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="row g-3 mb-3">
              <div className="col">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <AssignedSubtaskUserList
              taskAssignedUsers={taskAssignedUsers}
              subtaskAssignedUsers={subtaskAssignedUsers}
              onSubtaskUsersChange={(updatedUsers) =>
                setSubtaskAssignedUsers(updatedUsers)
              }
            />

            {/* Predecessor Selection */}
            <div className="mb-3">
              <label className="form-label">Choose Predecessor</label>
              <div className="predecessor-selection">
                {otherSubtasks
                  .filter((sub) => sub._id !== subtaskId) // Exclude the current subtask
                  .map((sub) => (
                    <span
                      key={sub._id}
                      className={`badge m-1 ${
                        predecessor === sub._id ? "bg-secondary" : "bg-primary"
                      }`}
                      style={{
                        cursor:
                          predecessor === sub._id ? "not-allowed" : "pointer",
                      }}
                      onClick={() => {
                        if (predecessor !== sub._id) {
                          setPredecessor(sub._id); // Set selected subtask as predecessor
                        }
                      }}
                    >
                      {sub.name}
                    </span>
                  ))}
              </div>
            </div>

            {/* Relation Type for Predecessor */}
            {predecessor && (
              <div className="mb-3">
                <label className="form-label">Relation Type</label>
                <div className="relation-types">
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      relation === "FS" ? "btn-success" : "btn-outline-success"
                    }`}
                    onClick={() => handleRelationChange("FS")}
                  >
                    Finish-to-Start (FS)
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      relation === "SF" ? "btn-danger" : "btn-outline-danger"
                    }`}
                    onClick={() => handleRelationChange("SF")}
                  >
                    Start-to-Finish (SF)
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      relation === "FF" ? "btn-info" : "btn-outline-info"
                    }`}
                    onClick={() => handleRelationChange("FF")}
                  >
                    Finish-to-Finish (FF)
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      relation === "SS" ? "btn-warning" : "btn-outline-warning"
                    }`}
                    onClick={() => handleRelationChange("SS")}
                  >
                    Start-to-Start (SS)
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              {subtask ? "Save Changes" : "Create Subtask"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtaskModal;
